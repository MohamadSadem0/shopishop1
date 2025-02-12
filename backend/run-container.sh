#!/bin/bash

docker run -p 8080:8080 \
  -e SPRING_MAIL_HOST=smtp.gmail.com \
  -e SPRING_MAIL_PORT=587 \
  -e SPRING_MAIL_USERNAME=mohamad.sadem@gmail.com \
  -e SPRING_MAIL_PASSWORD=befuxrzzhgovdump \
  -e SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true \
  -e SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true \
  springboot-app
