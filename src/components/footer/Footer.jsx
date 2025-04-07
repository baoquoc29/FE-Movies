import React from 'react';

import './footer.scss';

import { Link } from 'react-router-dom';

import bg from '../../assets/footer-bg.jpg';
import logo from '../../assets/tmovie.png';

const Footer = () => {
    return (
        <div className="footer" style={{ backgroundImage: `url(${bg})` }}>
            <div className="footer__content container">
                <div className="footer__content__logo">
                    <div className="logo">
                        <img src={logo} alt="" />
                        <Link to="/">tMovies</Link>
                    </div>
                </div>
                <div className="footer__content__menus">
                    <div className="footer__content__menu">
                        <Link to="/">Trang chủ</Link>
                        <Link to="/">Liên hệ</Link>
                        <Link to="/">Điều khoản dịch vụ</Link>
                        <Link to="/">Về chúng tôi</Link>
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/">Trực tiếp</Link>
                        <Link to="/">Câu hỏi thường gặp</Link>
                        <Link to="/">Gói cao cấp</Link>
                        <Link to="/">Chính sách bảo mật</Link>
                    </div>
                    <div className="footer__content__menu">
                        <Link to="/">Phim phải xem</Link>
                        <Link to="/">Phát hành gần đây</Link>
                        <Link to="/">Top IMDB</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
