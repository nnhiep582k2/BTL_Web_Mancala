import { Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MachinePage from "./Pages/MachinePage";
import PeoplePage from "./Pages/PeoplePage";
import LayoutDashboard from "./layout/LayoutDashboard";
function App() {
    return (
        <Routes>
            <Route element={<LayoutDashboard></LayoutDashboard>}>
                <Route path="/" element={<HomePage></HomePage>}></Route>
                <Route path="/machine" element={<MachinePage></MachinePage>}></Route>
                <Route path="/people" element={<PeoplePage></PeoplePage>}></Route>
            </Route>
        </Routes>
    );
}

export default App;
