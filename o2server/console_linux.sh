$(cd "$(dirname "$0")"; pwd)/jvm/linux_java11/bin/java -javaagent:$(cd "$(dirname "$0")"; pwd)/console.jar=shadow -cp $(cd "$(dirname "$0")"; pwd)/console.jar com.x.server.console.Shadow
