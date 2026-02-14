"use client";

import { useState } from "react";
import PanelLayout from "./panels/panel-layout";
import LeftPanel from "./panels/left-panel";
import Viewer from "./panels/viewer";
import RightPanel from "./panels/right-panel";

export default function DraftWorkspace() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <PanelLayout
      left={
        <LeftPanel
          activeTool={activeTool}
          setActiveTool={setActiveTool}
        />
      }
      center={<Viewer activeTool={activeTool} />}
      right={<RightPanel />}
    />
  );
}
