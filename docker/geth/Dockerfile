#FROM ethereum/client-go:latest

# Customized geth for large contract size deployment
FROM kazdock/go-client-couger:v1.0.0 as zkcream-geth

ADD . /root/
RUN /root/init.sh

ENTRYPOINT ["/root/entrypoint.sh"]