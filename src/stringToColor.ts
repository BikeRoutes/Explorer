import * as stringToColor from "string-to-color";
import { fromNullable } from "fp-ts/lib/Option";

export const hexToRgb = (hex: string) => {
  const result = fromNullable(
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  );

  return result.map(match => ({
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16)
  }));
};

export const isColorNice = (hexColor: string): boolean => {
  return hexToRgb(hexColor).fold(false, rgb => {
    const { r, g, b } = rgb;

    const colorArray = [r / 255, g / 255, b / 255].map(v => {
      if (v <= 0.03928) {
        return v / 12.92;
      }

      return Math.pow((v + 0.055) / 1.055, 2.4);
    });

    const luminance =
      0.2126 * colorArray[0] + 0.7152 * colorArray[1] + 0.0722 * colorArray[2];

    return luminance <= 0.5 && luminance >= 0.1;
  });
};

const stringToDarkColor = (string: string, color: string): string => {
  const newString = `${string}$`;
  return isColorNice(color)
    ? color
    : stringToDarkColor(newString, stringToColor(newString));
};

export default (string: string): string => {
  return stringToDarkColor(string, stringToColor(string));
};
