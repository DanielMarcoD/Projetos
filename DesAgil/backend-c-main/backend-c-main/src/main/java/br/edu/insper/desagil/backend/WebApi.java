// NÃO É NECESSÁRIO ENTENDER OU MODIFICAR ESTE ARQUIVO.
// Se realmente acha necessário, pergunte ao professor.

package br.edu.insper.desagil.backend;

import br.pro.hashi.sdx.dao.DaoClient;
import br.pro.hashi.sdx.rest.jackson.server.JacksonRestServerBuilder;
import br.pro.hashi.sdx.rest.server.RestServer;

public class WebApi {
	public static void main(String[] args) {
		DaoClient client = DaoClient.fromCredentials(Settings.CREDENTIALS_PATH);
		client.connect();

		RestServer server = new JacksonRestServerBuilder("br.edu.insper.desagil.backend.converter")
				.withClearPort(Settings.PORT)
				.withoutCors()
				.build("br.edu.insper.desagil.backend.resource");

		if (Settings.USE_TUNNEL) {
			server.startWithTunnel();
			System.out.println("Endereço: %s".formatted(server.getPublicUrl()));
		} else {
			server.start();
			System.out.println("Endereço: http://%s:%d".formatted(server.getPublicAddress(), Settings.PORT));
		}
	}
}
