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

export function copyToClipboard(textToCopy: string) {
  // navigator clipboard 需要https等安全上下文
  let force = false;
  if (navigator.clipboard && window.isSecureContext && !force) {
    // navigator clipboard 向剪贴板写文本
    return navigator.clipboard.writeText(textToCopy);
  } else {
    // 创建text area
    console.log("use docment copy...");
    let textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    // 使text area不在viewport，同时设置不可见
    textArea.style.position = "absolute";
    textArea.style.opacity = "0";
    textArea.style.left = "-9999px";
    textArea.style.top = "600px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise<void>((res, rej) => {
      // 执行复制命令并移除文本框
      document.execCommand("copy") ? res() : rej();
      textArea.remove();
    });
  }
}
