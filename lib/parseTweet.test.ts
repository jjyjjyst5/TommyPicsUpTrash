import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTweet } from "./parseTweet";

test("parses the real 700th Ohio River bag tweet", () => {
  const r = parseTweet(
    "Today, I removed my 700th bag of litter/trash from Pittsburgh's Ohio River in the past 3+ years (+ 2 boat bumpers, a blue wooden paddle, & a milk crate)."
  );
  assert.equal(r.bodySlug, "ohio-river");
  assert.equal(r.bodyConfidence, "high");
  assert.equal(r.cumulativeBags, 700);
  assert.equal(r.bags, null);
});

test("parses a bottle count from a KDKA-style morning", () => {
  const r = parseTweet("Picked up around 130 bottles this morning on the Ohio River.");
  assert.equal(r.bodySlug, "ohio-river");
  assert.equal(r.bottles, 130);
});

test("parses an increment haul on Stevenson Creek", () => {
  const r = parseTweet("Filled 8 large bags on Stevenson Creek in Clearwater today.");
  assert.equal(r.bodySlug, "stevenson-creek");
  assert.equal(r.bags, 8);
  assert.equal(r.cumulativeBags, null);
});

test("handles comma-separated numbers", () => {
  const r = parseTweet("Over 12,000 plastic bottles pulled from the creek so far.");
  assert.equal(r.bottles, 12000);
  assert.equal(r.bodySlug, "stevenson-creek");
});

test("flags unknown water body for manual selection", () => {
  const r = parseTweet("Another good day out there. 5 bags done.");
  assert.equal(r.bodySlug, null);
  assert.equal(r.bags, 5);
});
