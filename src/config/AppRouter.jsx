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
import MovieGrid from "../components/movie-grid/MovieGrid";
import FavoriteMovies from "../pages/FavoriteMovies";
import VipPackages from "../pages/membership/VipPackages";
import ActorGird from "../components/actor/ActorGrid";
import ActorDetail from "../components/actor/ActorDetail";

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
                <Route path="/favortie" element={<FavoriteMovies />} />
                <Route path="/membership" element={<VipPackages />} />
                <Route path="/search/:keyword" element={<MovieGrid />} />
                <Route path="/search/country/:nation" element={<MovieGrid />} />
                <Route path="/actors" element={<ActorGird />} />
                <Route path="/actor/practice/:key" element={<ActorDetail />} />
            </Routes>
            <Footer /> {/* Đặt Footer ở ngoài Routes */}
        </>
    );
}
