process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');
const { v4 } = require('uuid');

const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall3TldRNVlqQXhNamhpWmpVek1EQXhPV1V3WlRaaVppSXNJbVZ0WVdsc0lqb2lZbkoxYm05QWJXRnBiQzVqYjIwaUxDSnBZWFFpT2pFMk1UWTNORGN5TmpWOS51aWgyWVhVNXJObTNIbHkzb2k5Z21qRGMzZDF4WG9OTC1fcWdjZU9PUHY0In0=';

const doRequest = async () => {
  const title = v4();
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title, price: 5 },
    {
      headers: { cookie },
    }
  );

    await axios.put(
      `https://ticketing.dev/api/tickets/${data.ticket.id}`,
      { title, price: 10 },
      {
        headers: { cookie },
      }
    );    
  

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.ticket.id}`,
    { title, price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 400; i++) {
    try {
      doRequest();
    } catch (error) {
      console.log(error);
    }
  }
})();
