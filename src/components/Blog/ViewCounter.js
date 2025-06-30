"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ijsumcjuuhlfghpdmemn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlqc3VtZW1lZG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyODk5ODgsImV4cCI6MjA2Njg2NTk4OH0.US-hr1F-YOw85hfOZTSV6vFFXYqc285pHpbcsEixzVg"
);

const ViewCounter = ({
  slug,
  noCount = false,
  showCount = true,
}) => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (noCount) return;

    const upsertAndIncrement = async () => {
      // 1️⃣ Ensure slug row exists
      await supabase
        .from("views")
        .insert({ slug, count: 0 })
        .onConflict("slug")
        .ignore();

      // 2️⃣ Increment via RPC
      const { error } = await supabase.rpc("increment", {
        slug_text: slug,
      });
      if (error) console.error("Error incrementing view count:", error);
    };

    upsertAndIncrement();
  }, [slug, noCount]);

  useEffect(() => {
    const fetchViews = async () => {
      const { data, error } = await supabase
        .from("views")
        .select("count")
        .match({ slug })
        .maybeSingle();

      if (error) {
        console.error("Error fetching views:", error);
      } else {
        setViews(data?.count ?? 0);
      }
    };

    fetchViews();
  }, [slug]);

  if (!showCount) return null;
  return <div>{views.toLocaleString()} views</div>;
};

export default ViewCounter;
