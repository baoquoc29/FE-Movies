import { Button, Dropdown, Menu } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';

const currentUrl = encodeURIComponent(window.location.href);

const menu = (
    <Menu>
        <Menu.Item key="fb">
            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Chia sẻ lên Facebook
            </a>
        </Menu.Item>
        <Menu.Item key="twitter">
            <a
                href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=Khám phá ứng dụng này!`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Chia sẻ lên Twitter
            </a>
        </Menu.Item>
        <Menu.Item key="zalo">
            <a
                href={`https://zalo.me/share/url?url=${currentUrl}&title=Khám phá ứng dụng này!`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Chia sẻ lên Zalo
            </a>
        </Menu.Item>
        <Menu.Item key="email">
            <a href={`mailto:?subject=Khám phá ứng dụng này&body=${currentUrl}`}>
                Gửi qua Email
            </a>
        </Menu.Item>
    </Menu>
);

const ShareDropdown = () => (
    <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
        <Button icon={<ShareAltOutlined />}>Chia sẻ</Button>
    </Dropdown>
);

export default ShareDropdown;
