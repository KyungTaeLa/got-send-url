import { Method } from "got";

export interface IGotInput {
  /**
   * @alais url
   */
  url: string;
  /**
   * @alias method
   */
  method: Method;
  /**
   * @alias 요청 body
   * @description get일 경우 query-param 나머지는 body param
   */
  body?: any;
  /**
   * @alais header
   * @description key:value 형태의 객체
   */
  headers?: Record<string, string>;
  /**
   * @alias 통신 실패 시 재시도 횟수
   * @description 미설정 시 재시도 안함
   */
  retryLimit?: number;
  /**
   * @alias 재시도 설정 시 재시도 텀
   * @description 재시도 설정은 했으나 delay 미설정 시 1,2,4,8,16 초 ~ 횟수마다 배로 늘어남
   */
  retryDelay?: number;
  /**
   * @alias 응답 타입
   * @default json
   */
  responseType?: "text" | "json" | "buffer";
  /**
   * @alias 프록시 사용 여부(피들러 캡처 용)
   * @default false
   */
  useProxyYn?: boolean;
  /**
   * @alias 통신 간 예외 발생 시 throw 사용 여부
   * @default true
   */
  useThrowYn?: boolean;
  /**
   * @alias 통신 간 예외 발생 시 throw 사용 여부
   * @default false
   */
  getAllResponseYn?: boolean;
}
