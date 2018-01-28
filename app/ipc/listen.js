import { ipcMain } from 'electron';

export default (eventName, handler) => {
  ipcMain.on(eventName, async (e, request) => {
    const { id, data } = request;
    const response = { code: 200 };
    try {
      response.data = await handler(data);
    } catch (err) {
      response.code = err.code || 500;
      response.data = { message: err.message || 'Main thread error.' };
    }
    e.sender.send(`${eventName}_res_${id}`, response);
  });
};
