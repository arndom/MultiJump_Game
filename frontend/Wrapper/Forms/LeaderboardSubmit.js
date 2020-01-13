import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import md5 from 'md5';
import Koji from '@withkoji/vcc';
import styled from 'styled-components';
import PrimaryButton from '../Buttons/Primary';

const emailRegEx = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g);

const InputField = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 16px;

    label {
        margin-bottom: 4px;
        text-align: left;
    }

    input {
        padding: 4px;
        width: 100%;
    }

    input[type="checkbox"] {
        width: auto;
    }
`;

const CheckboxField = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;

    label {
        text-align: left;
        font-size: 13px;
    }

    input[type="checkbox"] {
        width: auto;
    }
`;

class LeaderboardSubmit extends PureComponent {
    static propTypes = {
        onSubmitSuccess: PropTypes.func,
        score: PropTypes.number,
    };

    static defaultProps = {
        onSubmitSuccess() {},
        score: 0,
    };

    state = {
        email: '',
        name: '',
        optIn: true,
        phone: '',
        submitting: false,
    };

    handleSubmit = e => {
        e.preventDefault();

        this.setState({ submitting: true });

        const body = {
            name: this.state.name,
            score: this.props.score,
            email: this.state.email,
            emailOptIn: this.state.emailOptIn,
            phone: this.state.phone,
        };

        const hash = md5(JSON.stringify(body));

        fetch(`${Koji.config.serviceMap.backend}/leaderboard/save`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: hash
            },
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(jsonResponse => {
                this.setState({ submitting: false });
                this.props.onSubmitSuccess();
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <InputField>
                    <label>{'Your Name'}</label>
                    <input
                        onChange={e => this.setState({ name: e.currentTarget.value })}
                        required
                        type={'text'}
                        value={this.state.name}
                    />
                </InputField>
                {
                    ['yes', 'required'].includes(Koji.config.postGameScreen.actions.emailCollection) &&
                    <InputField>
                        <label>{'Your Email'}</label>
                        <input
                            onChange={e => this.setState({ email: e.currentTarget.value })}
                            required={Koji.config.postGameScreen.emailCollection === 'required'}
                            type={'email'}
                            value={this.state.email}
                        />
                    </InputField>
                }
                {
                    ['yes', 'required'].includes(Koji.config.postGameScreen.actions.phoneCollection) &&
                    <InputField>
                        <label>{'Your Phone Number'}</label>
                        <input
                            onChange={e => this.setState({ phone: e.currentTarget.value })}
                            required={Koji.config.postGameScreen.phoneCollection === 'required'}
                            type={'tel'}
                            value={this.state.phone}
                        />
                    </InputField>
                }
                {
                    (['yes', 'required'].includes(Koji.config.postGameScreen.actions.emailCollection) || ['yes', 'required'].includes(Koji.config.postGameScreen.phoneCollection)) &&
                    <CheckboxField inline>
                        <input
                            checked={this.state.optIn}
                            onChange={e => this.setState({ optIn: e.currentTarget.checked })}
                            type={'checkbox'}
                        />
                        <label dangerouslySetInnerHTML={{ __html: Koji.config.postGameScreen.actions.optInText }} />
                    </CheckboxField>
                }
                <PrimaryButton
                    loading={this.state.submitting}
                    primaryColor={Koji.config.postGameScreen.actions.submitButtonColor}
                    type={'submit'}
                    text={Koji.config.postGameScreen.actions.submitButtonText}
                />
            </form>
        );
    }
}

export default LeaderboardSubmit;