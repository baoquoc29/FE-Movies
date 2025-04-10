import { Route, Routes } from 'react-router-dom'; // Import Route and Routes
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import 'swiper/swiper.min.css';
import '../assets/boxicons-2.0.7/css/boxicons.min.css';
import '../App.scss';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Detail from '../pages/detail/Detail';
import DepositScreen from "../pages/payment/DepositScreen";
import PaymentResult from "../pages/payment/PaymentResponse";
import MovieDetail from "../pages/detail/MovieDetail";
import WatchingMovie from "../pages/watching/WatchingMovie";

export function AppRouter() {
    return (
        <>
            <Header /> {/* Đặt Header ở ngoài Routes */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detail/:slug" element={<MovieDetail />} />
                <Route path="/watch/:slug/:ep" element={<WatchingMovie />} />
                <Route path="/payment" element={<DepositScreen />} />
                <Route path="/result" element={<PaymentResult />} />
                <Route path="/movie" element={<Catalog />} />
                <Route path="/tv" element={<Catalog />} />
                <Route path="/:category/search/:keyword" element={<Catalog />} />
                <Route path="/:category/:id" element={<Detail />} />
            </Routes>
            <Footer /> {/* Đặt Footer ở ngoài Routes */}
        </>
    );
}
