package gradude.springVision.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${backend.local}")
    private String backendLocal;
    @Value("${backend.dev-http}")
    private String backendDevHttp;
    @Value("${backend.dev-https}")
    private String backendDevHttps;

    @Bean
    public OpenAPI openAPI() {
        Server localServer = new Server();
        localServer.setUrl(backendLocal);

        Server devHttpServer = new Server();
        devHttpServer.setUrl(backendDevHttp);

        Server devHttpsServer = new Server();
        devHttpsServer.setUrl(backendDevHttps);

        return new OpenAPI()
                .servers(List.of(localServer, devHttpServer, devHttpsServer))
                .components(new Components()
                        .addSecuritySchemes("Authorization", securityScheme()))
                .addSecurityItem(new SecurityRequirement().addList("Authorization"))
                .info(getInfo());
    }

    private Info getInfo() {
        return new Info()
                .title("다시 봄 API Document")
                .description("다시 봄 API document 입니다.")
                .version("1.0.0");
    }

    private SecurityScheme securityScheme() {
        return new SecurityScheme()
                .name("Authorization")
                .type(SecurityScheme.Type.HTTP)
                .scheme("Bearer")
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER);
    }
}
