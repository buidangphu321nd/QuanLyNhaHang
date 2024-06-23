import React from "react";

const generateID = () => {
  const time = new Date();
  const id = time.getTime();
  return id;
}

export default generateID;
