import { Box, Flex, Link } from '@chakra-ui/layout';
import React from 'react';
import githubLogo from '../../../images/Github/GitHub-Mark-64px.png';
import twitterLogo from '../../../images/Twitter/Twitter logo/SVG/Logo black.svg';
import mediumLogo from '../../../images/Medium/03_Symbol/01_Black/SVG/Medium_Symbol_NoPadding.svg';
import { GITHUB_REPO, MEDIUM, TWITTER } from '../../../constants/static';

export const Footer: React.FC<{}> = () => {
    return (
        <Box id="footer" textColor="text.primary">
            <Flex
                flexDir="row"
                justify={{
                    base: "space-around",
                    md: "end"
                }}
                align="center"
                h={20}
            >

                <Flex id="social-icons"
                    flexDir="row"
                    gridGap={7}
                >
                    <FooterIcon
                        id="github-link"
                        href={GITHUB_REPO}
                        logo={githubLogo}
                        alt="Github Logo"
                    />
                    <FooterIcon
                        id="medium-link"
                        href={MEDIUM}
                        logo={mediumLogo}
                        alt="Medium Logo"
                    />
                    <FooterIcon
                        id="twitter-link"
                        href={TWITTER}
                        logo={twitterLogo}
                        alt="Twitter Logo"
                    />
                </Flex>
            </Flex>
        </Box>
    )
}

const FooterIcon: React.FC<{
    id: string;
    href: string;
    logo: string;
    alt: string;
}> = (props) => {
    const {id, logo, alt, href} = props;

    return <Link href={href} target="_blank">
        <Flex id={id} h={8} w={8} flexDir="column" justify="center">
            <img src={logo} alt={alt}/>
        </Flex>
    </Link>
}


export default Footer;