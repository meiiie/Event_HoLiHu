// Define contract addresses with unique keys
export const ContractAddresses = {
  QuanLyCuocBauCu: "0x9d8cB9C2eD2EFedae3F7C660ceDCBBc90BA48dd8",
  QuanLyPhieuBauToanCuc: "0xEc113165EedF505CF66D70c67d3216603B450e16",
  QuanLyThanhTuuToanCuc: "0xB615f47022985A1abD686CFf2AC37dCEa78Dd1bF",
  HoLiHuToken: "0x0c69a0bF43618D8ba8465e095F78AdB3A15F2666",
  EntryPoint: "0x5c1Ec052254B485A97eFeCdE6dEC5A7c3c171656",
  HLUPaymaster: "0x68eD6525Fa00B2A0AF28311280b46f6E03C5EE4a",
  CuocBauCuFactory: "0x93e3b7720CAf68Fb4E4E0A9ca0152f61529D9900",
  QuanLyPhieuBauProxy: "0x9c244B5E1F168510B9b812573b1B667bd1E654c8",
  QuanLyThanhTuuProxy: "0x93362A6A30570b1446843862c2c4150002557152",
}

// Default explorer URL
export const EXPLORER_URL = "https://explorer.holihu.online/transactions"

// Function to get transaction URL
export const getTransactionUrl = (txHash: string) => {
  return `${EXPLORER_URL}/${txHash}`
}
