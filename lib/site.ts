/**
 * Constantes do site (URLs externas, rótulos, etc.) usadas por componentes
 * que não pertencem ao domínio do blog em si — por exemplo o link "Ir para
 * loja" no header, que aponta para o e-commerce da Mobility Brasil.
 */

export const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL ?? "https://www.mobilitybrasil.com.br";

export const HELP_URL = `${STORE_URL}/atendimento`;
export const ACCOUNT_URL = `${STORE_URL}/login`;
