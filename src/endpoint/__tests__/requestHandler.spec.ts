import axios from "axios";
import { requestHandler } from "../requestHandler";

const axiosInstance = axios.create();

const axiosCancelToken = axios.CancelToken.source();

describe("requestHandler", () => {
  it("handle the requests through axios request", () => {
    axiosInstance.request = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ data: "asd" }));
    requestHandler({
      requestConfiguration: {
        url: "http://example.com",
        method: "get",
        cancelToken: axiosCancelToken.token,
      },
      axiosInstance,
    });
    expect(axiosInstance.request).toHaveBeenCalledTimes(1);
    expect(axiosInstance.request).toHaveBeenCalledWith({
      url: "http://example.com",
      method: "get",
      cancelToken: axiosCancelToken.token,
    });
  });
  it("returns a Promise", () => {
    axiosInstance.request = jest
      .fn()
      .mockImplementation(() => Promise.reject({ data: "asd" }));
    const res = requestHandler({
      requestConfiguration: {
        url: "http://example.com",
        method: "get",
        cancelToken: axiosCancelToken.token,
      },
      axiosInstance,
    });
    expect(res).toBeInstanceOf(Promise);
  });
  describe("resolves", () => {
    it("with rawResponse and data", () => {
      axiosInstance.request = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ data: "asd" }));
      const res = requestHandler({
        requestConfiguration: {
          url: "http://example.com",
          method: "get",
          cancelToken: axiosCancelToken.token,
        },
        axiosInstance,
      });
      expect(res).resolves.toEqual({
        rawResponse: { data: "asd" },
        data: "asd",
        success: true,
      });
    });
    it("and calls responseTransformer", () => {
      const stubbedPromise = Promise.resolve({ data: "asd" });
      const responseTransformer = jest.fn();
      axiosInstance.request = jest
        .fn()
        .mockImplementation(() => stubbedPromise);
      requestHandler({
        requestConfiguration: {
          url: "http://example.com",
          method: "get",
          cancelToken: axiosCancelToken.token,
        },
        responseTransformer,
        axiosInstance,
      });
      stubbedPromise
        .then(() => {
          expect(responseTransformer).toHaveBeenCalledTimes(1);
          expect(responseTransformer).toHaveBeenCalledWith("asd");
        })
        .catch((errors) => errors);
    });
  });
  describe("fails", () => {
    it("with rawResponse and data", () => {
      axiosInstance.request = jest.fn().mockImplementation(() =>
        Promise.reject({
          response: { data: "error" },
        })
      );
      const res = requestHandler({
        requestConfiguration: {
          url: "http://example.com",
          method: "get",
          cancelToken: axiosCancelToken.token,
        },
        errorTransformer: (e) => e,
        responseTransformer: (r) => r,
        axiosInstance,
      });
      expect(res).resolves.toEqual({
        rawResponse: { data: "error" },
        data: "error",
        success: false,
      });
    });
    it("and calls errorTransformer", () => {
      const stubbedPromise = Promise.reject({
        response: { data: "error" },
      });
      const errorTransformer = jest.fn();
      axiosInstance.request = jest
        .fn()
        .mockImplementation(() => stubbedPromise);
      requestHandler({
        requestConfiguration: {
          url: "http://example.com",
          method: "get",
          cancelToken: axiosCancelToken.token,
        },
        errorTransformer,
        axiosInstance,
      });
      stubbedPromise
        .then((response) => response)
        .catch(() => {
          expect(errorTransformer).toHaveBeenCalledTimes(1);
          expect(errorTransformer).toHaveBeenCalledWith("error");
        });
    });
  });
});
