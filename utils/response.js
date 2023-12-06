const writeResponse = (res, data ,status, contentType) => {
  res.writeHead(status, { "Content-Type": contentType });
  res.write(JSON.stringify(data));
  res.end();
};

module.exports = {
  writeResponse,
};
