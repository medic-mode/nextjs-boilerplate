import React from "react";
import {
  Container,
  Heading,
  Text,
  Img,
  Link,
  Section,
  Row,
  Column,
} from "@react-email/components";

export default function WelcomeEmail({ firstName }) {
  return (
    <Container style={{ maxWidth: 700, margin: '0 auto'}}>
      <table style={{ width: '100%', marginTop: 0 }}>
        <tr style={{ width: '100%' }}>
          <td align="center">
            <Img
              alt="medicmode logo"
              height="80"
              src="https://d15k2d11r6t6rl.cloudfront.net/pub/bfra/1e6bf8rq/303/ube/rh5/medicmode-logo-slogan.png"
            />
          </td>
        </tr>
      </table>
      <Section style={{ marginTop: 0, textAlign: 'left', color: '#0A4044' }}>
        <Text style={{ marginTop: 16, marginBottom: 16, fontSize: 18, lineHeight: '28px', fontWeight: 600 }}>
          Dear {firstName},
        </Text>
        <Heading as="h1" style={{ margin: '0px', marginTop: 8, fontSize: 30, lineHeight: '36px', fontWeight: 600 }}>
          Welcome to Medicmode!
        </Heading>
        <Text style={{ fontSize: 16, lineHeight: '24px' }}>
          You&#x27;re now part of a growing community dedicated to enhancing paramedic skills, careers, and opportunities.
        </Text>
        <Row>
          <Text style={{ marginTop: 8, fontSize: 20, fontWeight: 600, marginBottom: 5 }}>
            Here&#x27;s What&#x27;s Next:
          </Text>
          <Text style={{ marginTop: 8, fontSize: 16, lineHeight: '24px' }}>
            Login to your account: <a href="https://www.medicmode.com" target="_blank">www.medicmode.com</a>
          </Text>
        </Row>
        <Row>
          <Text style={{ marginTop: 8, fontSize: 20, lineHeight: '28px', fontWeight: 600 }}>
            What You Can Do:
          </Text>
          <Text style={{ marginTop: 10, fontSize: 16, marginBottom: 5 }}>
            🚑 Browse job opportunities in the Careers section
          </Text>
          <Text style={{ marginTop: 5, fontSize: 16, marginBottom: 5 }}>
            📚 Enroll in specialized courses and workshops
          </Text>
          <Text style={{ marginTop: 5, fontSize: 16 }}>
            🩺 Stay updated with the latest in prehospital care
          </Text>
        </Row>
        <Row>
          <Text style={{ marginTop: 5, fontSize: 16, marginBottom: 5 }}>
            Need help? Contact us at <a href="mailto:contact@medicmode.com" target="_blank" rel="noreferrer">contact@medicmode.com</a> anytime.
          </Text>
          <Text style={{ marginTop: 5, fontSize: 16, marginBottom: 5 }}>
            We&#x27;re excited to have you with us! Let&#x27;s take paramedicine to the next level.
          </Text>
          <Text style={{ marginTop: 5, fontSize: 16, fontWeight: 500, marginBottom: 20 }}>
            Stay sharp. Stay skilled. Stay ahead.
          </Text>
        </Row>
        <Section style={{ textAlign: 'left' }}>
          <Text style={{ marginTop: 5, fontSize: 16, marginBottom: 0 }}>
            Best Wishes,
          </Text>
          <Text style={{ marginTop: 5, fontSize: 16, marginBottom: 0 }}>
            The Medicmode Team
          </Text>
          <Text style={{ marginTop: 0, fontSize: 16 }}>
            <a href="https://www.medicmode.com" target="_blank" rel="noreferrer">www.medicmode.com</a>
          </Text>
        </Section>
        <table style={{ width: '100%', marginTop: 0 }}>
          <tr>
            <td align="center">
              <Row style={{ display: 'table-cell', height: 44, width: 56, verticalAlign: 'bottom' }}>
                <Column style={{ paddingRight: 8 }}>
                  <Link href="https://www.facebook.com/medicmodeofficial" target="_blank"
          rel="noreferrer">
                    <Img alt="Facebook" height="36" src="https://img.icons8.com/color/48/facebook-new.png" width="36" />
                  </Link>
                </Column>
                <Column style={{ paddingRight: 8 }}>
                  <Link href="https://www.instagram.com/medicmode/" target="_blank"
          rel="noreferrer">
                    <Img alt="Instagram" height="36" src="https://img.icons8.com/color/48/instagram-new--v1.png" width="36" />
                  </Link>
                </Column>
                <Column style={{ paddingRight: 8 }}>
                  <Link href="https://www.linkedin.com/company/medicmode-llp/" target="_blank"
          rel="noreferrer">
                    <Img alt="X" height="36" src="https://img.icons8.com/color/48/linkedin.png" width="36" />
                  </Link>
                </Column>
                <Column>
                  <Link href="https://www.youtube.com/@medicmode623/" target="_blank"
          rel="noreferrer">
                    <Img alt="YouTube" height="36" src="https://img.icons8.com/color/48/youtube-play.png" width="36" />
                  </Link>
                </Column>
              </Row>
            </td>
          </tr>
        </table>
        <Text style={{ marginTop: 0, fontSize: 16, textAlign: 'center' }}>
          Follow us to stay updated with the latest updates!
        </Text>
      </Section>
    </Container>
  );
}