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

const DUTT_KISHKINDHA_SECTION_SPAN_SHA256: Record<number, string> = {
  1: "79ef56e71e4e7149dce35c0403ff2da524ac571297abf77e13997a5e72dd02cb",
  2: "47b51e76dd29d1ae369c98fa2edba86713e38984a09234d5c688a881dd863b4a",
  3: "62a631e14ca8eb1a82ac2f70c9f2be77fd989109cb638fc8795d0d4110b683df",
  4: "6fcbfc4b861a63c4c47b06b5030ca3b133855c05cf616be5416aefaf5699cd0e",
  5: "4a44eb06489a8ee774addf53bfe759e9894764ab575eb480d36ceee181926ed8",
  6: "1a83a2ad25c70adb0a8940767d19dffa7df84461e2c61ed9fbf2cbef828b1ea1",
  7: "ed740511398f01306a160453afa902ce89c7f9537690e3cb3b7b2092ab8fcb29",
  8: "e520aca5a7ecebb91223c4722daaf7515067a1cb69616e2a797423a8207af7ed",
  9: "ba6d7ddb5126b3896a1352890ab2ab6b0526790379231cdd333650e34e79ac5b",
  10: "f5c8d0c11686f0e847f98241f29efe66cd34649294a28e258ce4f1a01d7e81c0",
  11: "92b790efc6f6d5e665dcb8fa0116923387cff805c63127fcb918adaf74a93881",
  12: "ea96048d57a7f33ebf4a7a4324fabc9dbc32718708fa51213b4a0f6d0c8ffb8e",
  13: "951511822afca98755bedc4be54776e735aca55d4e5b1319b2ec395e8ef76d29",
  14: "b4ab5d988aa5c6500a6c8c75be7afa1e0039a778b7f9a1f24523a66938d3ebf2",
};

const maps: Record<string, Record<number, string>> = {
  bala: DUTT_BALA_SECTION_SPAN_SHA256,
  aranya: DUTT_ARANYA_SECTION_SPAN_SHA256,
  kishkindha: DUTT_KISHKINDHA_SECTION_SPAN_SHA256,
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
