import React from 'react'
import { withSiteData } from 'react-static'
import { Card, Form, Row, Col, Input, Button } from 'antd'

export default withSiteData(() => (
	<Card>
		<h1>Instant Domain Monitor</h1>
		<p>Start monitoring the expiration date of any domain name instantly.</p>

		<br />
		<h2>How it works</h2>
		<ul>
			<li>List the domain names you want to monitor.</li>
			<li>Receive a weekly report by email (see an <a>example</a>), during 1 year, renewable.</li>
			<li>Pay $1 for each domain.</li>
		</ul>

		<br />
		<h2>Domain names</h2>
		<Form>
			<Form.Item style={{ marginBottom: 1 }}>
				<Row>
					<Col span={21}>
						<Input placeholder="www.example.com" />
					</Col>
					<Col span={3}>
						<Button type="danger" size="small" shape="circle" icon="minus" style={{ marginLeft: 5 }} />
						<Button type="primary" size="small" shape="circle" icon="plus" style={{ marginLeft: 5 }} />
					</Col>
				</Row>
			</Form.Item>
		</Form>

		<br />
		<h2>Your Email</h2>
		<Form>
			<Form.Item>
				<Row>
					<Col span={21}>
						<Input placeholder="name@example.com" />
					</Col>
					<Col span={3}>
					</Col>
				</Row>
			</Form.Item>
		</Form>

		<div>
			<Button type="primary" size="large">Start monitoring for $1</Button>
		</div>

		<br />
		<br />
		<h2>FAQ</h2>
		<div>
			<br />
			<h3>Can I add more domains later?</h3>
			<p>Yes, you can simply create a new list using the same email address as before. We will consolidate all your domain names and deliver a single weekly report. (Please continue reading this FAQ in order to understand how you will be charged.)</p>

			<br />
			<h3>Can I remove domains from my report?</h3>
			<p>Only when the report is due to renew. Then, you will have the opportunity to review your domain names  list.</p>

			<br />
			<h3>When do I have to renew the report?</h3>
			<p>You will be contacted to renew the report one year after its creation date and every year after that.</p>

			<br />
			<h3>How much will the renewal cost?</h3>
			<p>The cost will be $1 for each domain name present in the report at the time of the renewal.</p>
			<p>For example, let's say your report was created in the 31st of January 2017 with 10 domain names for $10, and in October 2017 you have added 5 more domains for $5. The renewal will cost $15, due in the 31st of January 2018.</p>

			<br />
			<h3>Can I change my email address?</h3>
			<p>You can contact <a>support</a> to do it for you.</p>
		</div>

		<br />
	</Card>
))
