import React from 'react'
import styled from 'styled-components'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Layout from '../layouts'
import SEO from '../components/seo'
import BG from '../components/bg'
import { Button } from '../components/button'
import ProtocolData from '../components/protocolData'
import { useDarkMode } from '../contexts/Application'
import { CardBGImage, CardGlimmerImage } from '../components/utils'

import PinkGlimmer from '../images/pink_glimmer.inline.svg'
import Twitter from '../images/twitter.inline.svg'
import Github from '../images/github.inline.svg'
import Discord from '../images/discord.inline.svg'
import DevImage from '../images/developer.png'
import GovImage from '../images/governance.png'
import AppsImage from '../images/apps.png'

const BGCard = styled.span`
  width: 100vw;
  height: 100vh;
  max-height: 1220px;
  user-select: none;
  background-repeat: no-repeat;
  background: ${({ theme }) => theme.heroBG};
  background-size: contain;
  mix-blend-mode: overlay;

  @media (max-width: 960px) {
    width: 100vw;
    height: 100vh;
  }
`

const StyledBody = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 3rem;
  border-bottom: 1px solid ${({ theme }) => theme.buttonBorder};
  @media (max-width: 960px) {
    margin-bottom: 0;
    padding: 1rem;
    padding-bottom: 8rem;
  }
`

const StyledTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  will-change: transform;
  align-items: flex-start;
  height: 30vh;
  margin-bottom: 4rem;
`

const StyledBodyTitle = styled.h1`
  font-size: 56px;
  white-space: wrap;
  overflow-wrap: normal;
  @media (max-width: 1024px) {
    margin: 2rem 0 0rem 0;
  }

  @media (max-width: 640px) {
    width: 100%;
    margin: 2rem 0 2rem 0;
    font-weight: 500;
    text-align: left;
    font-size: 58px;
  }

  @media (max-width: 440px) {
    font-weight: 500;
    text-align: left;
    font-size: 52px;
  }
`
const StyledBodySubTitle = styled.h2`
  max-width: 720px;
  line-height: 125%;
  font-weight: 400;
  text-align: left;

  @media (max-width: 640px) {
    text-align: left;
  }
`

const StyledBodySubText = styled.h3`
  max-width: 960px;
  line-height: 140%;
  opacity: 0.8;
  @media (max-width: 640px) {
    text-align: left;
  }
`

const StyledSectionTitle = styled.h3`
  max-width: 960px;
  line-height: 140%;
  font-size: 32px;
  @media (max-width: 640px) {
    text-align: left;
  }
`

const StyledProductImage = styled(Img)`
  width: 100%;
  max-width: 120px;
  margin-bottom: 2rem;
  background-color: none;
  border-radius: 12px;
`

const StyledSocialRow = styled.nav`
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
  & > *:not(:first-of-type) {
    margin-top: 0;
    margin-left: 16px;
  }
`

const StyledItemRow = styled.nav`
  display: flex;
  flex-direction: column;

  margin: 0rem;
  & > *:not(:first-of-type) {
    margin-top: 12px;
  }
  @media (min-width: 960px) {
    flex-direction: row;
    & > * {
      margin-bottom: 12px;
    }
    & > *:not(:first-of-type) {
      margin-top: 0;
      margin-left: 12px;
    }
  }
`

const StyledItemColumn = styled.nav`
  display: flex;
  flex-direction: column;

  & > *:not(:last-of-type) {
    margin-bottom: 12px;
  }
`

const StyledPinkGlimmer = styled(PinkGlimmer)`
  margin: 0;
  width: 48px;
  height: 48px;
  position: relative;
  top: -24px;
  right: -32px;
  margin-left: -50px;
  margin-right: 2px;
  transition: transform 0.2s linear;
  :hover {
    transform: rotate(-10deg);
  }
`

const StyledTwitter = styled(Twitter)`
  path {
    fill: ${({ theme }) => theme.textColor};
  }
  width: 24px;
  height: 24px;
`

const StyledDiscord = styled(Discord)`
  path {
    fill: ${({ theme }) => theme.textColor};
  }
  width: 24px;
  height: 24px;
`

const StyledGithub = styled(Github)`
  path {
    fill: ${({ theme }) => theme.textColor};
  }
  width: 24px;
  height: 24px;
`
const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.cardBG};
  border: 1px solid ${({ theme }) => theme.buttonBorder};
  padding: 2rem;
  border-radius: 24px;
  box-shadow: ${({ theme }) => theme.shadows.huge};
`

const HideSmall = styled.span`
  @media (max-width: 960px) {
    display: none;
  }
`

const StyledTradeLink = styled.a`
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.textColor};
  text-decoration: none;
  color: ${({ theme }) => theme.invertedTextColor};
  border-radius: 12px;
  display: inline-block;
  font-weight: 500;
  width: 100%;
  width: min-content;
  white-space: nowrap;
  border: 1px solid transparent;
  box-shadow: ${({ theme }) => theme.shadows.small};
  display: none;

  :hover,
  :focus {
    border: 1px solid white;
  }
  @media (max-width: 960px) {
    display: inline-block;
  }
`
const IndexPage = props => {
  const isDark = useDarkMode()

  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          siteUrl
        }
      }
      banner: file(relativePath: { eq: "Banner.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
      grants: file(relativePath: { eq: "unigrants.png" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
      discord: file(relativePath: { eq: "discord.png" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      twitter: file(relativePath: { eq: "twitter.png" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      reddit: file(relativePath: { eq: "reddit.png" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      discourse: file(relativePath: { eq: "discourse.png" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      devs: file(relativePath: { eq: "devs.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 1200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Layout path={props.location.pathname}>
      <BGCard>
        {/* <CardNoise /> */}
        <CardGlimmerImage isDark={isDark} />
        <CardBGImage isDark={isDark} />
        {/* <CardFade /> */}
      </BGCard>
      <SEO
        title="Home"
        path={props.location.pathname}
        description={'StartCy, a digital first community'}
      />
      <StyledBody>
        <StyledTitle>
          <StyledBodyTitle>
            <span style={{ fontWeight: 200 }}>StartCy</span>
            <StyledPinkGlimmer />
          </StyledBodyTitle>
          <StyledBodySubTitle>
            {'StartCy, a digital first community'}
          </StyledBodySubTitle>

          <StyledTradeLink
            style={{
              background: `linear-gradient(128.17deg, #FCB813 -14.78%, #F6921E 110.05%)`,
              color: 'dark'
            }}
            target="_blank"
            href="https://forms.gle/XL47wX1q7Xd5RvkC7"
          >
            Join US
          </StyledTradeLink>
          <StyledSocialRow>
            <a href="https://twitter.com/startcydao?s=11&t=SdrUlxvj9HtebuHtIT935Q">
              <StyledTwitter />
            </a>
            <a href="https://github.com/StartCy">
              <StyledGithub />
            </a>
            <a href="https://discord.gg/PAJKJcrD">
              <StyledDiscord />
            </a>
          </StyledSocialRow>
        </StyledTitle>
        <EcosystemSection data={data} props={props} />
        <HideSmall>
          <StyledSectionHeader>
            <a href="https://info.uniswap.org/">{'COMMUNITY ANALYTICS →'}</a>
          </StyledSectionHeader>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '4rem 0 3rem 0'
            }}
          >
            <ProtocolData />
          </div>
        </HideSmall>
        <DeveloperSection data={data} props={props} />
      </StyledBody>
      <BG />
    </Layout>
  )
}

export default IndexPage

const StyledSectionHeader = styled.h1`
  font-size: 20px;
  white-space: wrap;
  overflow-wrap: normal;
  max-width: 900px;
  font-weight: 500;

  a {
    color: ${({ theme }) => theme.textColor};
  }

  @media (max-width: 960px) {
    width: 100%;
    /* font-size: 2rem; */
    line-height: 2.5rem;
    max-width: 600px;
    margin-top: 4rem;
  }
  @media (max-width: 640px) {
    width: 100%;
    font-weight: 400;
    margin-top: 4rem;
    text-align: left;
  }
`

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;

  @media (max-width: 640px) {
    margin: 0;
  }
`

export const DeveloperCard = styled(StyledCard)`
  mix-blend-mode: ${({ isDark }) => (isDark ? 'overlay' : 'lighten')};
  background: url(${DevImage});
  color: dark;
  background-size: cover;
  background-repeat: no-repeat;
`

export const GovernanceCard = styled(StyledCard)`
  mix-blend-mode: ${({ isDark }) => (isDark ? 'overlay' : 'lighten')};
  background: url(${GovImage});
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 12px;
  @media (max-width: 960px) {
    margin-bottom: 12px;
    margin-right: 0px;
  }
`

export const AppsCard = styled(StyledCard)`
  background: url(${AppsImage});
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 12px;
  width: 100%;
  min-height: 290px;
  max-width: 590px;

  h1 {
    font-size: 48px;
    font-weight: 700;
    margin: 0;
    margin-bottom: 0.25rem;
  }

  p {
    opacity: 0.6;
    font-size: 20px;
    font-weight: 300;
  }

  @media (max-width: 960px) {
    margin-bottom: 12px;
    margin-right: 0px;
    max-width: unset;
  }
`

export const GrantsCard = styled(StyledCard)`
  max-width: 375px;
  @media (max-width: 960px) {
    max-width: unset;
  }
`

const EcosystemSection = () => {
  return (
    <StyledSection>
      <StyledItemRow>
        <span>
          <StyledSectionHeader>{'StartCy ECOSYSTEM →'}</StyledSectionHeader>
          <StyledSectionTitle>A growing community network for DeFi Apps.</StyledSectionTitle>
          <StyledBodySubText style={{ marginRight: '48px' }}>
          StartCy is a community that provides non-zero-sum game culture system to help people exchange non-physical resources like ideas, talent and capital.
          </StyledBodySubText>
        </span>
        <AppsCard>
          <h1>COMMUNITY</h1>
          <p>As an Ecosystem</p>
        </AppsCard>
      </StyledItemRow>
    </StyledSection>
  )
}

const DeveloperSection = props => {
  return (
    <>
      <StyledSection>
        <StyledSectionHeader>{'DEVELOPERS →'}</StyledSectionHeader>
        <StyledItemRow>
        <StyledSectionHeader>
            <StyledSectionTitle>The StartCy mission</StyledSectionTitle>
            <StyledBodySubTitle style={{ fontSize: '20px' }}>
            The StartCy mission is to create the eBay for non-physical resources like ideas, talent and capital.
            </StyledBodySubTitle>

         
            <Button href="" outlined>
              <p style={{ margin: 0 }}>Developer Documentation ↗</p>
            </Button>
            
            </StyledSectionHeader>
          <GrantsCard>
            <StyledProductImage fadeIn={false} fluid={props.data.grants.childImageSharp.fluid} />
            <StyledBodySubTitle>Apply for the StartCy Developer Grants Program</StyledBodySubTitle>
            <p>
              Get paid to build the future of finance. StartCy Governance offers grant funding for people building apps,
              tools, and activities on the StartCy Community.
            </p>
            <Button href="" outlined>
              <p style={{ margin: 0 }}>Learn more ↗</p>
            </Button>
          </GrantsCard>
        </StyledItemRow>
      </StyledSection>

      <StyledSection>
        <StyledSectionHeader>{'GOVERNANCE →'}</StyledSectionHeader>
        <StyledItemRow>
        <StyledSectionHeader>
            <span>
              <StyledSectionTitle>Governed by the community.</StyledSectionTitle>
              <StyledBodySubTitle style={{ fontSize: '20px' }}>
                The StartCy Community is governed by a decentralized community of SCC token holders and their delegates
                who propose and vote on upgrades to the protocol.
              </StyledBodySubTitle>
            </span>

            <Button href="" outlined>
              <p style={{ margin: 0 }}>Read more </p>
            </Button>
            </StyledSectionHeader>
          <StyledItemColumn style={{ display: 'flex', flexDirection: 'column' }}>
            <Button style={{ borderRadius: '20px' }} href="https://gov.uniswap.org" outlined>
              <div style={{ padding: '1rem' }}>
                <StyledBodySubTitle style={{ marginBottom: '0.25rem' }}>
                  Governance Forum <span style={{ fontSize: '16px' }}>↗</span>
                </StyledBodySubTitle>
                <p style={{ textAlign: 'left', margin: '0', opacity: '0.6', fontSize: '16px', fontWeight: 400 }}>
                  Participate by proposing upgrades and discussing the future of the protocol with the StartCy
                  community.
                </p>
              </div>
            </Button>
            <Button style={{ borderRadius: '20px' }} href="" outlined>
              <div style={{ padding: '1rem' }}>
                <StyledBodySubTitle style={{ marginBottom: '0.25rem' }}>
                  Sybil <span style={{ fontSize: '16px' }}>↗</span>
                </StyledBodySubTitle>
                <p style={{ textAlign: 'left', margin: '0', opacity: '0.6', fontSize: '16px', fontWeight: 400 }}>
                  Vote on offchain proposals with the Snapshot interface. Votes are weighted by the number of SCC
                  delegates.
                </p>
              </div>
            </Button>
            <Button style={{ width: '100%', borderRadius: '20px' }} href="" outlined>
              <div style={{ padding: '1rem' }}>
                <StyledBodySubTitle style={{ marginBottom: '0.25rem' }}>
                  Governance Portal <span style={{ fontSize: '16px' }}>↗</span>
                </StyledBodySubTitle>
                <p style={{ textAlign: 'left', margin: '0', opacity: '0.6', fontSize: '16px', fontWeight: 400 }}>
                  Vote on official StartCy governance proposals and view past proposals.{' '}
                </p>
              </div>
            </Button>
          </StyledItemColumn>
        </StyledItemRow>
      </StyledSection>
    </>
  )
}
