"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [dark,setDark]=useState(false);
  useEffect(()=>{
    const saved=localStorage.getItem("elprof-theme");
    const prefers=window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next=saved?saved==="dark":prefers;
    document.documentElement.dataset.theme=next?"dark":"light";
    setDark(next);
  },[]);
  function toggle(){
    const next=!dark;
    document.documentElement.dataset.theme=next?"dark":"light";
    localStorage.setItem("elprof-theme",next?"dark":"light");
    setDark(next);
  }
  return <button className="theme-toggle" onClick={toggle} aria-label={dark?"Activer le mode clair":"Activer le mode sombre"} title={dark?"Mode clair":"Mode sombre"}>{dark?"☀️":"🌙"}</button>;
}
