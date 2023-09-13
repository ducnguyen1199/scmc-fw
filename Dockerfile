FROM node:18.16.0-alpine
ENV LANG C.UTF-8
# system update
RUN apk update && \
    apk add vim less && \
    apk add curl git && \
    apk add --no-cache --upgrade bash

# install yarn command.
RUN curl -o- -L https://yarnpkg.com/install.sh | sh -s -- --version 1.22.15
ENV PATH $HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH

COPY . /app
WORKDIR /app

EXPOSE 3000

COPY docker-cli.sh /usr/bin/
RUN chmod +x /usr/bin/docker-cli.sh

ENTRYPOINT ["/usr/bin/docker-cli.sh"]
