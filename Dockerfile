FROM alpine:3.22

WORKDIR /lab

CMD ["sh", "-c", "echo 'GoBit Docker Lab is running'; sleep 3600"]