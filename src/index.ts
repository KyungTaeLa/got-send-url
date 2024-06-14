import got, { Options } from "got";
import { IGotInput } from "./interface/send-url.interface";
import { HttpsProxyAgent } from "https-proxy-agent";
/**
 * @alias got 모듈 사용한 통신 함수
 * @description https://github.com/sindresorhus/got/blob/HEAD/documentation/7-retry.md#retry
 * @returns
 */
const sendURL = async ({
  url,
  method,
  body,
  headers,
  retryLimit,
  retryDelay,
  responseType = "json",
  useProxyYn = false,
  useThrowYn = true,
}: IGotInput): Promise<any> => {
  try {
    // 프록시 사용이면서 https 인지 확인
    const notUseTLS =
      url.startsWith("https") && useProxyYn && process.env.NODE_ENV === "dev";

    // got 통신 모듈 옵션들
    const options: Options = {
      responseType,
      method,
    };

    // 재시도 사용 시
    if (retryLimit) {
      options.retry = {
        // 재시도 횟수
        limit: retryLimit,
        // 재시도 사용 method
        methods: ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS", "TRACE"],
      };

      // 재시도 텀
      // 미설정 시 횟수마다 1초 2초 4초 8초 ..... ~ 배로 늘어남
      retryDelay
        ? (options.retry.calculateDelay = ({ attemptCount }) => {
            if (attemptCount > retryLimit) {
              return 0;
            }
            return retryDelay;
          })
        : null;
    }

    // 헤더 정보
    if (headers) {
      options.headers = headers;
    }

    // 프록시 설정 여부 (피들러 캡처 용)
    if (useProxyYn) {
      options.agent = {
        http: new HttpsProxyAgent("http://127.0.0.1:8888"),
        https: new HttpsProxyAgent("http://127.0.0.1:8888"),
        // http2: new HttpsProxyAgent('http://127.0.0.1:8888'),
      };
    }

    // 피들러 캡처 시 unable to verify the first certificate 에러가 발생하여 tls 인증 미사용
    if (notUseTLS) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }

    // 반환 객체
    let response;
    if (headers["Content-Type"].includes("urlencoded")) {
      // get 일 경우
      if (method === "GET") {
        options.searchParams = body;
        response = await got(url, options);
      } else {
        // 이 외 모든 메서드
        options.body = body;
        response = await got(url, options);
      }
    } else {
      // get 일 경우
      if (method === "GET") {
        options.searchParams = body;
        response = await got(url, options);
      } else {
        // 이 외 모든 메서드
        options.json = body;
        response = await got(url, options);
      }
    }

    // tls 인증 여부 되돌리기
    if (notUseTLS) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
    }

    // 응답 객체의 body만 반환
    return response.body;
  } catch (error) {
    // throw 여부에 따라 throw 날려줌
    if (useThrowYn) {
      throw error;
    }

    // throw 미사용 시 error 객체 그대로 반환
    return error;
  }
};
export default sendURL;
