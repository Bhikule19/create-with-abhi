import { describe, it, expect } from "vitest";
import { resolveCursorState } from "@/lib/cursor-state";

function el(html: string): HTMLElement {
  const root = document.createElement("div");
  root.innerHTML = html;
  return root.querySelector("[data-target]") as HTMLElement;
}

describe("resolveCursorState", () => {
  it("returns default for plain elements", () => {
    expect(resolveCursorState(el(`<p data-target>hi</p>`))).toBe("default");
  });

  it("returns view inside a data-cursor=view container", () => {
    expect(
      resolveCursorState(
        el(`<div data-cursor="view"><img data-target /></div>`),
      ),
    ).toBe("view");
  });

  it("returns link for anchors and buttons without annotation", () => {
    expect(resolveCursorState(el(`<a href="#" data-target>go</a>`))).toBe(
      "link",
    );
    expect(resolveCursorState(el(`<button data-target>go</button>`))).toBe(
      "link",
    );
  });

  it("explicit data-cursor wins over tag defaults", () => {
    expect(
      resolveCursorState(el(`<a href="#" data-cursor="view" data-target>go</a>`)),
    ).toBe("view");
  });

  it("returns default for null targets", () => {
    expect(resolveCursorState(null)).toBe("default");
  });
});
