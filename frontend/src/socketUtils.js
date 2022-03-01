import { io } from 'socket.io-client';
import { API_HOST } from "./environment/constants";

let socket = null;

export const initiateSocket = (room) => {
    socket = io(API_HOST);
    console.log(`Web socket connected`);
}

export function subscribeToUpdateNotes(callback) {
    socket.on('refreshNotes', () => {
        console.log('update notes from the web socket')
        callback()
    });
}

export const updateNotesExceptSender = () => {
    socket.emit('updateNotesExceptSender', '');
    console.log('ask to the server to update Notes except the sender')
}

export const disconnectSocket = () => {
    socket.disconnect();
    console.log(`Web socket disconnected`);
}
