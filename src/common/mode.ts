export type TableDataType = {
  SMILES: string;
  img1: string;
  img2: string;
  mean: number;
  median: number;
  std: number;
  title: string;
};

export type TableGenDataType = {
  Left_ArticleDOI: string[];
  Left_Frag: string;
  Left_PatentNumber: string;
  Left_mean: number;
  Left_median: number;
  Left_scaffold: string;
  Left_std: number;
  Right_ArticleDOI: string[];
  Right_Frag: string;
  Right_PatentNumber: string;
  Right_mean: number;
  Right_median: number;
  Right_scaffold: string;
  Right_std: number;
  SMILES: string;
  title: string;
};

export function getDoiUrl(doi: string) {
  return `https://doi.org/${doi}`;
}
