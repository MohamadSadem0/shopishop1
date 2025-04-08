package com.example.ShopiShop.config;

import org.apache.catalina.connector.Connector;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {

   @Bean
   public WebServerFactoryCustomizer<TomcatServletWebServerFactory> servletContainerCustomizer() {
       return factory -> {
           // Add HTTP connector on port 8080
           Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
           connector.setPort(8080);
           factory.addAdditionalTomcatConnectors(connector);
       };
   }
}
