package br.edu.insper.desagil.backend;

import br.pro.hashi.sdx.dao.DaoClient;

public class Fixture {
	public static void main(String[] args) {
		DaoClient client = DaoClient.fromCredentials(Settings.CREDENTIALS_PATH);
		client.connect();

		/* NÃO MODIFIQUE NADA ACIMA DESTA LINHA. */

		//
		// Escreva seu código aqui.
		//

		/* NÃO MODIFIQUE NADA ABAIXO DESTA LINHA. */

		client.disconnect();
	}
}
