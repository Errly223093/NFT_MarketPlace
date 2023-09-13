import { BrowserRouter, Routes, Route, useActionData } from "react-router-dom";
import Main from "./pages/Main";
import Detail from "./pages/Detail";
import MyNft from "./pages/MyNft";
import Trade from "./pages/Trade";
import Header from "./components/Header";
import { FaUikit } from "react-icons/fa";
import { useState } from "react";
import Intro from "./components/Intro";

function App() {
  const [account, setAccount] = useState();

  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen text-white">
        <Header account={account} setAccount={setAccount} />
        <Routes>
          <Route path="/" element={<Main account={account} />} />
          <Route path="/MyNft" element={<MyNft account={account} />} />
          <Route path="/:tokenId" element={<Detail />} />
          <Route path="/Trade" element={<Trade account={account} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
