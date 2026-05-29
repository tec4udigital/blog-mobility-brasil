<?php
/**
 * Plugin Name: Mobility Revalidate (Headless Next.js)
 * Description: Dispara webhooks de revalidação ISR para o front-end Next.js
 *              do Blog Mobility Brasil sempre que posts, páginas ou categorias
 *              são publicados, editados ou removidos. Independente de tema.
 * Version:     1.0.0
 * Author:      TEC4U Digital
 * License:     GPLv2 or later
 * Text Domain: mobility-revalidate
 *
 * Convenção de tags (espelha lib/wordpress.ts):
 *   - posts
 *   - post:{slug}
 *   - categories
 *   - category:{slug}
 *   - page:{uri}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MOBILITY_REVALIDATE_VERSION', '1.0.0' );
define( 'MOBILITY_REVALIDATE_OPTION', 'mobility_revalidate_settings' );

/* -------------------------------------------------------------------------
 * Configurações (Admin → Configurações → Mobility Revalidate)
 * ------------------------------------------------------------------------- */

function mobility_revalidate_default_settings(): array {
	return array(
		'endpoint' => '',
		'secret'   => '',
		'enabled'  => 1,
	);
}

function mobility_revalidate_get_settings(): array {
	$saved = get_option( MOBILITY_REVALIDATE_OPTION, array() );
	return wp_parse_args( is_array( $saved ) ? $saved : array(), mobility_revalidate_default_settings() );
}

function mobility_revalidate_register_settings(): void {
	register_setting(
		'mobility_revalidate_group',
		MOBILITY_REVALIDATE_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'mobility_revalidate_sanitize_settings',
			'default'           => mobility_revalidate_default_settings(),
		)
	);
}
add_action( 'admin_init', 'mobility_revalidate_register_settings' );

function mobility_revalidate_sanitize_settings( $input ): array {
	$input = is_array( $input ) ? $input : array();
	return array(
		'endpoint' => isset( $input['endpoint'] ) ? esc_url_raw( trim( $input['endpoint'] ) ) : '',
		'secret'   => isset( $input['secret'] ) ? sanitize_text_field( trim( $input['secret'] ) ) : '',
		'enabled'  => ! empty( $input['enabled'] ) ? 1 : 0,
	);
}

function mobility_revalidate_admin_menu(): void {
	add_options_page(
		'Mobility Revalidate',
		'Mobility Revalidate',
		'manage_options',
		'mobility-revalidate',
		'mobility_revalidate_render_settings_page'
	);
}
add_action( 'admin_menu', 'mobility_revalidate_admin_menu' );

function mobility_revalidate_render_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$settings = mobility_revalidate_get_settings();
	$test_result = '';
	if ( isset( $_POST['mobility_revalidate_test_nonce'] ) && wp_verify_nonce( wp_unslash( $_POST['mobility_revalidate_test_nonce'] ), 'mobility_revalidate_test' ) ) {
		$test_result = mobility_revalidate_dispatch( array( 'posts' ), array(), true );
	}
	?>
	<div class="wrap">
		<h1>Mobility Revalidate</h1>
		<p>Configurações do webhook ISR para o front-end Next.js (Blog Mobility Brasil).</p>

		<form method="post" action="options.php">
			<?php settings_fields( 'mobility_revalidate_group' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="mr_endpoint">Endpoint do front-end</label></th>
					<td>
						<input
							type="url"
							id="mr_endpoint"
							name="<?php echo esc_attr( MOBILITY_REVALIDATE_OPTION ); ?>[endpoint]"
							value="<?php echo esc_attr( $settings['endpoint'] ); ?>"
							class="regular-text"
							placeholder="https://blog.mobilitybrasil.com.br/api/revalidate"
							required
						/>
						<p class="description">URL completa da rota <code>/api/revalidate</code> do Next.js.</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="mr_secret">Secret</label></th>
					<td>
						<input
							type="password"
							id="mr_secret"
							name="<?php echo esc_attr( MOBILITY_REVALIDATE_OPTION ); ?>[secret]"
							value="<?php echo esc_attr( $settings['secret'] ); ?>"
							class="regular-text"
							autocomplete="new-password"
							required
						/>
						<p class="description">Mesmo valor de <code>WORDPRESS_REVALIDATE_SECRET</code> definido na Vercel.</p>
					</td>
				</tr>
				<tr>
					<th scope="row">Status</th>
					<td>
						<label>
							<input
								type="checkbox"
								name="<?php echo esc_attr( MOBILITY_REVALIDATE_OPTION ); ?>[enabled]"
								value="1"
								<?php checked( 1, (int) $settings['enabled'] ); ?>
							/>
							Disparar webhooks automaticamente
						</label>
					</td>
				</tr>
			</table>
			<?php submit_button( 'Salvar configurações' ); ?>
		</form>

		<hr />
		<h2>Testar conexão</h2>
		<p>Dispara um POST de teste com a tag <code>posts</code>.</p>
		<form method="post">
			<?php wp_nonce_field( 'mobility_revalidate_test', 'mobility_revalidate_test_nonce' ); ?>
			<?php submit_button( 'Disparar teste', 'secondary', 'mr_test_submit', false ); ?>
		</form>
		<?php if ( $test_result ) : ?>
			<div style="margin-top:1rem;padding:1rem;border:1px solid #ccd0d4;background:#f6f7f7;">
				<strong>Resultado:</strong>
				<pre style="white-space:pre-wrap;margin:.5rem 0 0;"><?php echo esc_html( $test_result ); ?></pre>
			</div>
		<?php endif; ?>
	</div>
	<?php
}

/* -------------------------------------------------------------------------
 * Dispatcher — envia o POST para o endpoint do Next.js
 * ------------------------------------------------------------------------- */

function mobility_revalidate_dispatch( array $tags, array $paths = array(), bool $return_diagnostic = false ) {
	$settings = mobility_revalidate_get_settings();

	if ( empty( $settings['enabled'] ) ) {
		return $return_diagnostic ? 'desativado nas configurações' : null;
	}
	if ( empty( $settings['endpoint'] ) || empty( $settings['secret'] ) ) {
		return $return_diagnostic ? 'endpoint ou secret não configurados' : null;
	}

	$tags  = array_values( array_unique( array_filter( array_map( 'strval', $tags ) ) ) );
	$paths = array_values( array_unique( array_filter( array_map( 'strval', $paths ) ) ) );

	if ( empty( $tags ) && empty( $paths ) ) {
		return $return_diagnostic ? 'nenhuma tag/path' : null;
	}

	$body = wp_json_encode( array( 'tags' => $tags, 'paths' => $paths ) );

	$args = array(
		'method'    => 'POST',
		'timeout'   => $return_diagnostic ? 10 : 4,
		'blocking'  => $return_diagnostic,
		'headers'   => array(
			'Content-Type'        => 'application/json',
			'X-Revalidate-Secret' => $settings['secret'],
			'User-Agent'          => 'Mobility-Revalidate/' . MOBILITY_REVALIDATE_VERSION,
		),
		'body'      => $body,
	);

	$response = wp_remote_post( $settings['endpoint'], $args );

	if ( is_wp_error( $response ) ) {
		$msg = 'mobility-revalidate: ' . $response->get_error_message();
		error_log( $msg );
		return $return_diagnostic ? $msg : null;
	}

	if ( $return_diagnostic ) {
		$code = wp_remote_retrieve_response_code( $response );
		$body = wp_remote_retrieve_body( $response );
		return "HTTP {$code}\n{$body}";
	}
	return null;
}

/* -------------------------------------------------------------------------
 * Coleta de tags por entidade
 * ------------------------------------------------------------------------- */

function mobility_revalidate_tags_for_post( int $post_id ): array {
	$post = get_post( $post_id );
	if ( ! $post ) {
		return array( 'posts' );
	}

	$tags = array( 'posts' );

	if ( $post->post_type === 'post' ) {
		if ( ! empty( $post->post_name ) ) {
			$tags[] = 'post:' . $post->post_name;
		}
		$categories = get_the_terms( $post_id, 'category' );
		if ( is_array( $categories ) ) {
			foreach ( $categories as $cat ) {
				if ( ! empty( $cat->slug ) ) {
					$tags[] = 'category:' . $cat->slug;
				}
			}
		}
	} elseif ( $post->post_type === 'page' ) {
		$uri = get_page_uri( $post_id );
		if ( $uri ) {
			$tags[] = 'page:' . trim( $uri, '/' );
		}
	}

	return $tags;
}

function mobility_revalidate_tags_for_term( $term_id, string $taxonomy ): array {
	$tags = array();
	if ( $taxonomy === 'category' ) {
		$tags[] = 'categories';
		$term   = get_term( $term_id, $taxonomy );
		if ( $term && ! is_wp_error( $term ) && ! empty( $term->slug ) ) {
			$tags[] = 'category:' . $term->slug;
		}
		$tags[] = 'posts';
	}
	return $tags;
}

/* -------------------------------------------------------------------------
 * Hooks: posts, páginas, ACF, categorias
 * ------------------------------------------------------------------------- */

function mobility_revalidate_should_skip_post( int $post_id, WP_Post $post ): bool {
	if ( wp_is_post_revision( $post_id ) ) return true;
	if ( wp_is_post_autosave( $post_id ) ) return true;
	if ( $post->post_status === 'auto-draft' ) return true;
	if ( ! in_array( $post->post_type, array( 'post', 'page' ), true ) ) return true;
	return false;
}

// Dispara em publish/unpublish/trash/restore/etc.
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( ! $post instanceof WP_Post ) return;
	if ( mobility_revalidate_should_skip_post( $post->ID, $post ) ) return;
	if ( $new_status === $old_status && $new_status !== 'publish' ) return;
	mobility_revalidate_dispatch( mobility_revalidate_tags_for_post( $post->ID ) );
}, 10, 3 );

// ACF salva campos *depois* do save_post — usar prioridade alta para pegar valores atualizados.
add_action( 'acf/save_post', function ( $post_id ) {
	$post_id = is_numeric( $post_id ) ? (int) $post_id : 0;
	if ( $post_id <= 0 ) return;
	$post = get_post( $post_id );
	if ( ! $post ) return;
	if ( mobility_revalidate_should_skip_post( $post_id, $post ) ) return;
	if ( $post->post_status !== 'publish' ) return;
	mobility_revalidate_dispatch( mobility_revalidate_tags_for_post( $post_id ) );
}, 20 );

// Exclusão definitiva (após esvaziar lixeira ou delete forçado).
add_action( 'before_delete_post', function ( $post_id ) {
	$post = get_post( $post_id );
	if ( ! $post ) return;
	if ( mobility_revalidate_should_skip_post( (int) $post_id, $post ) ) return;
	mobility_revalidate_dispatch( mobility_revalidate_tags_for_post( (int) $post_id ) );
} );

// Categorias — criar / editar / excluir.
foreach ( array( 'created_category', 'edited_category', 'delete_category' ) as $hook ) {
	add_action( $hook, function ( $term_id ) {
		mobility_revalidate_dispatch( mobility_revalidate_tags_for_term( $term_id, 'category' ) );
	} );
}

/* -------------------------------------------------------------------------
 * Link "Revalidar" na lista de posts (atalho manual)
 * ------------------------------------------------------------------------- */

add_filter( 'post_row_actions', function ( $actions, $post ) {
	if ( ! current_user_can( 'manage_options' ) ) return $actions;
	if ( ! in_array( $post->post_type, array( 'post', 'page' ), true ) ) return $actions;
	$url = wp_nonce_url(
		admin_url( 'admin-post.php?action=mobility_revalidate_manual&post=' . $post->ID ),
		'mobility_revalidate_manual_' . $post->ID
	);
	$actions['mobility_revalidate'] = '<a href="' . esc_url( $url ) . '">Revalidar cache</a>';
	return $actions;
}, 10, 2 );

add_action( 'admin_post_mobility_revalidate_manual', function () {
	$post_id = isset( $_GET['post'] ) ? (int) $_GET['post'] : 0;
	if ( ! current_user_can( 'manage_options' ) || $post_id <= 0 ) wp_die( 'forbidden' );
	check_admin_referer( 'mobility_revalidate_manual_' . $post_id );
	mobility_revalidate_dispatch( mobility_revalidate_tags_for_post( $post_id ) );
	wp_safe_redirect( wp_get_referer() ?: admin_url( 'edit.php' ) );
	exit;
} );
