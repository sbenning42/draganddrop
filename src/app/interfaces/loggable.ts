export abstract class Loggable {

    log(message) {
        const messageToLog = typeof message === 'string'
            ? message
            : JSON.stringify(message);
        console.log(messageToLog);
    }

}
