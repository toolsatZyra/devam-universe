import { DUTT_BALA_SECTION_SPAN_SHA256 } from "./ramayana-bala-source-spans";

const DUTT_ARANYA_SECTION_SPAN_SHA256: Record<number, string> = {
  54: "cefe140ee3545b0cf1cbe59c173145782c866f261365f948ee4c7211af4b3efa",
  55: "19816adc65a8d2c1691bd29ab19ac2bdfd296cf3150df8b06e96c25122276012",
  56: "bf7a2d8e76b9aad332b7aa955868d50dfafac23fcd4127b8975630cfbaa27cc1",
  57: "b1dde937b966c17eee12de7d38eca317742ffac51bcbe84be3418d26c11d25f7",
  58: "42817e4a0e602677e3e1327357e165131a7f5aa5af7a6007a3b23a6a70fa204f",
  59: "a87a4b031fc0f6b21b5866dc0aba393ea29040b0ef82f2d325f493b6cb180799",
  60: "58de764ac489c96ba66a2a614b86d9f9919e31485287f92ac7b4e93ec90b60ed",
  61: "38ffa3d91c1f64750c9d3cb214086683fdc9841e641ba1f91d37932b62bdd0b0",
  62: "3b12d1aaf0ba09d8dcf36d153aba0eed7cd14106cd1ef47265b1ca9555bd6307",
  63: "210e51515064f7daa250ad9d31e0a054d11a91b62dcc254846b49de0dfe794fa",
  64: "1bcd8fdada786ff7647de5cd666065911be75d98f622177a5c8bcbb50609dae8",
  65: "fba917002ef0b552f46e3a570620172067df0b583ffb017f829d62958e37ae5c",
  66: "864a9599b5c78cd1779138dbfb150cc73af35c7d34c8033f0a457b0ca4a4506f",
  67: "f53c2cf95a8013d44cc99e3dcee975760fd601630c3bbb8566af3d51674e6381",
  68: "98806743acf1dd4f72f8cd47334e2e53362a8395cb32077210416bf4d387b8f7",
  69: "cc2f87bcd0ca7d2e7879951a30d00ecf3f9ef745b8f2e5973960306aaa75385d",
  70: "c21cc83f13712ac8df5d83e10d7bb443f97a086f3ca18e0ee49f985c32ab3060",
  71: "8e9c5f6e3dd5acbcf045c0e1b2cb3f866dcf8f7a3d3da5162a6121001272c5a3",
  72: "33e1d1e9102f8e2e84a1500fbe74d4d2fa077ee41071018eec23577ef8b84ff3",
  73: "2b3f38b8b6ce733d04ccd2f5d2f53f1b4d9a9729d95546373f9ef0ef4ba1347a",
  74: "0974ca75c1327ffba42b9853c06367b95d932f6e2dffcb9bbde0dd888e46e62b",
  75: "635d58b041c6db2afa07a478de28748ab617d4388061c35fc086242c70107009",
};

const maps: Record<string, Record<number, string>> = {
  bala: DUTT_BALA_SECTION_SPAN_SHA256,
  aranya: DUTT_ARANYA_SECTION_SPAN_SHA256,
};

export function getDuttKandaSpanSha256s(kandaSlug: string, startOrdinal: number, endOrdinal: number) {
  const map = maps[kandaSlug];
  if (!map || !Number.isInteger(startOrdinal) || !Number.isInteger(endOrdinal) || startOrdinal < 1 || endOrdinal < startOrdinal) {
    throw new Error(`Invalid Dutt source span: ${kandaSlug} ${startOrdinal}-${endOrdinal}`);
  }
  return Array.from({ length: endOrdinal - startOrdinal + 1 }, (_, index) => {
    const ordinal = startOrdinal + index;
    const hash = map[ordinal];
    if (!hash) throw new Error(`Missing Dutt source span: ${kandaSlug} ${ordinal}`);
    return hash;
  });
}
