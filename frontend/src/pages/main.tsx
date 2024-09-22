import Footer from "./commons/footer";
import Header from "./commons/header";
import Home from "./home";

export default function MainApp() {
    return (
        <div className="main-app">
            <Header />
            <Home />
            <Footer />
        </div>
    );
}