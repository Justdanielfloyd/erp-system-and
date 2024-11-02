"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import localforage from "localforage";

//Ref: https://github.com/vercel/next.js/discussions/15687?ref=hackernoon.com

const createNoopStorage = () => {
  return {
    getItem: function (key: string) {
      return Promise.resolve(null);
    },
    setItem: function (key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem: function (key: string) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? localforage.createInstance({ name: "AnnexApp" })
    : createNoopStorage();

export default storage;
