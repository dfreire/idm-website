import _ from 'underscore'
import numeral from 'numeral';
import React from 'react'
import { withSiteData } from 'react-static'
import { Card, Form, Row, Col, Input, Button, Alert, message } from 'antd'
import psl from 'psl'

const currency = '$';
const basePrice = 1.50;
const priceFormat = `${currency}0.00`;

class Home extends React.Component {
	state = createInitialState();

	componentWillMount() {
		Paddle.Setup({ vendor: 21790 });

		const now = Date.now();
		const savedAt = JSON.parse(localStorage.getItem('savedAt')) || 0;
		const oneHour = 60 * 60 * 1000;

		if ((now - savedAt) > oneHour) {
			localStorage.clear();
		}

		localStorage.setItem('savedAt', JSON.stringify(now));
	}

	render() {
		return (
			<Card>
				{this._renderHeader()}
				{this._renderHowItWorks()}
				{this._renderDomainList()}
				{this._renderEmail()}
				{this._renderSubmitButtons()}
				{this._renderFAQ()}
			</Card>
		);
	}

	_renderHeader() {
		return (
			<div>
				<h1>Instant Domain Monitor</h1>
				<p>Start monitoring the expiration date of any domain name</p>
			</div>
		);
	}

	_renderHowItWorks() {
		return (
			<div>
				<br />
				<h2>How it works</h2>
				<ol style={{ paddingLeft: 30, lineHeight: '1.8em' }}>
					<li>List the domain names you want to monitor</li>
					<li>Pay {formatPrice(basePrice)}/year for each monitored domain</li>
					<li>Receive a weekly report by email (see <a>example</a>)</li>
				</ol>
			</div>
		);
	}

	_renderDomainList() {
		return (
			<div>
				<br />
				<Row type="flex" align="bottom">
					<Col span={22}>
						<h2>Domain names</h2>
					</Col>
					<Col span={2}>
						<Button
							style={{ margin: 5 }}
							type="primary"
							size="small"
							shape="circle"
							icon="plus"
							onClick={this._onClickAddDomain}
							disabled={this.state.loading}
						/>
					</Col>
				</Row>
				<Form>
					{this.state.domains.map((domain, i) => {
						return (
							<Row key={i}>
								<Col span={22}>
									<Form.Item
										style={{ marginBottom: 1 }}
										validateStatus={domain.hasError ? 'error' : 'success'}
										help={domain.helpMessage.length > 0 &&
											<p style={{ marginLeft: 12, marginTop: 2, marginBottom: 5, fontSize: '0.9em' }}>
												{domain.helpMessage}
											</p>
										}
									>
										<Input
											placeholder="example.com"
											value={domain.name}
											onChange={evt => this._onChangeDomainName(i, evt.target.value.trim())}
											disabled={this.state.loading}
										/>
									</Form.Item>
								</Col>
								<Col span={2} style={{ marginTop: 8 }}>
									<Button
										style={{ marginLeft: 5 }}
										type="danger"
										size="small"
										shape="circle"
										icon="minus"
										onClick={() => this._onClickRemoveDomain(i)}
										disabled={this.state.domains.length === 1 || this.state.loading}
									/>
								</Col>
							</Row>
						);
					})}
				</Form>
			</div>
		);
	}

	_renderEmail() {
		return (
			<div>
				<br />
				<h2>Your Email</h2>
				<Form>
					<Form.Item
						style={{ marginBottom: 1 }}
						validateStatus={this.state.emailHasError ? 'error' : 'success'}
						help={this.state.emailHasError &&
							<p style={{ marginLeft: 12, marginTop: 2, marginBottom: 0, fontSize: '0.9em' }}>
								{this.state.emailHasError}
							</p>
						}
					>
						<Row>
							<Col span={22}>
								<Input
									placeholder="name@example.com"
									value={this.state.email}
									onChange={evt => this._onChangeEmail(evt.target.value.trim())}
									disabled={this.state.loading}
								/>
							</Col>
							<Col span={2}>
							</Col>
						</Row>
					</Form.Item>
				</Form>
			</div>
		)
	}

	_renderSubmitButtons() {
		return (
			<div>
				<br />
				<Row gutter={24}>
					<Col span={11}>
						{this._renderPayButton()}
					</Col>
					<Col span={11}>
						{this._renderFeedbackButton()}
					</Col>
				</Row>
			</div>
		);
	}

	_renderPayButton() {
		const validNamesLen = extractValidNames(this.state.domains).length;

		return (
			<Button
				style={{ width: '100%' }}
				type="primary"
				size="large"
				onClick={this._onClickPay}
				loading={this.state.loading}
			>
				Start monitoring for {formatPrice(validNamesLen * basePrice)}
			</Button>
		);
	}

	_renderFeedbackButton() {
		return (
			<Button
				style={{ width: '100%', fontSize: '0.9em' }}
				type="dashed"
				size="large"
				disabled={this.state.loading}
			>
				Or give us your feedback
			</Button>
		);
	}

	_renderSuccessMessage() {
		return this.state.showSuccessMessage && (
			<Row gutter={24}>
				<Col span={22}>
					<br />
					<Alert
						type="success"
						message={
							<div>
								<h3>Thank you for using our service</h3>
								<p>We will start sending you weekly reports by mail</p>
							</div>
						}
						closable={true}
						onClose={() => this.setState({ showSuccessMessage: false })}
					/>
				</Col>
			</Row>
		);
	}

	_renderFAQ() {
		return (
			<div>
				<br />
				<br />
				<h2>FAQ</h2>
				<div>
					<br />
					<h3>Can I add more domains later?</h3>
					<p>Yes, you can simply create a new list and use the same email address as before. We will consolidate all your domain names and deliver a single weekly report.</p>
					<p>If you happen to repeat a domain name you were already monitoring, don't worry, we automatically detect duplicates and not charge twice.</p>

					<br />
					<h3>Can I remove domains from my report?</h3>
					<p>You can contact <a>support</a> to do it for you.</p>

					<br />
					<h3>Can I change my email address?</h3>
					<p>You can contact <a>support</a> to do it for you.</p>

					<br />
					<h3>Which TLDs do you support?</h3>
					<p>Although we cannot guarantee we will support all TLDs in existence, our goal is to support as many as possible. We currently support more than 1000 TLDs, including the most popular gTLDs and ccTLDs.</p>
					<p>We also validate all the domain names in your list before you pay, so unsupported TLDs will not be included.</p>
				</div>
			</div>
		)
	}

	_onClickAddDomain = () => {
		const domains = [...this.state.domains];
		domains.push(createEmptyDomain());
		this.setState({ domains });
		localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onClickRemoveDomain = (i) => {
		const domains = [...this.state.domains];
		domains.splice(i, 1);
		this.setState({ domains });
		localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onChangeDomainName = (i, name) => {
		const domain = this._getUpdatedDomain(i, name);
		const domains = [...this.state.domains];
		domains[i] = domain;
		this.setState({ domains });
		localStorage.setItem('domains', JSON.stringify(domains));
	}

	_onChangeEmail = (email) => {
		const emailHasError = email.length > 0 && !validateEmail(email);
		const domains = this.state.domains.map((domain, i) => this._getUpdatedDomain(i, domain.name));
		this.setState({ email, emailHasError, domains });
		localStorage.setItem('email', JSON.stringify(email));
	}

	_getUpdatedDomain = (i, name) => {
		const domain = { ...this.state.domains[i] };
		domain.name = name;

		if (name.length === 0) {
			domain.hasError = false;
			domain.validName = '';
			domain.helpMessage = '';

		} else if (psl.isValid(name)) {
			domain.hasError = false;
			domain.validName = psl.parse(name).domain;
			domain.helpMessage = domain.name !== domain.validName ? `Same as: ${validName}` : '';

		} else {
			domain.hasError = true;
			domain.validName = '';
			domain.helpMessage = '';
		}

		return domain;
	}

	_onClickPay = async () => {
		console.log('state', this.state);

		if (this.state.email.length === 0 && this.state.emailHasError) {
			message.error('Please fix the errors in order to proceed');
			this.setState({ emailHasError: true });
			return;
		}

		for (let domain of this.state.domains) {
			if (domain.hasError) {
				message.error('Please fix the errors in order to proceed');
				return;
			}
		}

		const validNames = extractValidNames(this.state.domains);
		if (validNames.length === 0) {
			message.error('Please insert some domains');
			return;
		}

		this.setState({ loading: true });

		const validateResponse = await fetch('/api/validate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				names: validNames
			}),
		}).then(response => response.json());

		const validByName = validateResponse.result || {};

		let hasError = false;
		let domains = [...this.state.domains];
		for (let domain of domains) {
			if (domain.validName.length > 0 && validByName[domain.validName] !== true) {
				domain.hasError = true;
				domain.helpMessage = 'Domain not supported';
				hasError = true;
			}
		}

		if (hasError) {
			message.error('Please fix the errors in order to proceed');
			this.setState({ loading: false, domains });
			return;
		}

		const monitoredResponse = await fetch('/api/monitored', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				names: validNames,
				email: this.state.email,
			}),
		}).then(response => response.json());
		console.log('monitoredResponse', monitoredResponse);
		const monitoredNames = monitoredResponse.result || [];

		hasError = false;
		domains = [...this.state.domains];
		for (let domain of domains) {
			if (domain.validName.length > 0 && monitoredNames.indexOf(domain.validName) >= 0) {
				domain.hasError = true;
				domain.helpMessage = `Domain already monitored by: ${this.state.email}`;
				hasError = true;
			}
		}

		if (hasError) {
			message.error('Please fix the errors in order to proceed');
			this.setState({ loading: false, domains });
			return;
		}

		const monitorNames = _.difference(validNames, monitoredNames);
		const checkout_id = uuidv4();

		// Paddle.Checkout.open({
		// 	product: 525713,
		// 	quantity: monitorNames.length,
		// 	email,
		// 	passthrough: checkout_id,
		// 	successCallback: (data) => {
		const checkoutResponse = await fetch('/api/checkout', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				names: monitorNames,
				email: this.state.email,
				checkout_id: checkout_id,
				paddle_response: JSON.stringify({})
			}),
		}).then(response => response.json());
		console.log('checkoutResponse', checkoutResponse);

		message.success('Thank you for using our service. You will receive a weekly report by email!');
		this.setState({ loading: false });
		// localStorage.clear();
	}
}

function createInitialState() {
	const emptyDomains = [];
	for (let i = 0; i < 3; i++) {
		emptyDomains.push(createEmptyDomain());
	}

	const domains = JSON.parse(localStorage.getItem('domains')) || emptyDomains;
	const email = JSON.parse(localStorage.getItem('email')) || '';

	return {
		domains,
		email,
		emailHasError: '',
		loading: false,
	};
}

function createEmptyDomain() {
	return { name: '', validName: '', helpMessage: '', hasError: false };
}

function extractValidNames(domains) {
	return _.chain(domains)
		.pluck('name')
		.filter(name => psl.isValid(name))
		.map(name => psl.parse(name).domain)
		.uniq()
		.value();
}

function formatPrice(price) {
	const priceStr = numeral(price).format(priceFormat);
	const tokens = priceStr.split('.');
	return (
		<span>
			<span>{tokens[0]}</span>
			<span>.</span>
			<span style={{ fontSize: '0.9em' }}>{tokens[1]}</span>
		</span>
	);
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: any) {
		const r = Math.random() * 16 | 0;
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}


export default withSiteData(Home)
