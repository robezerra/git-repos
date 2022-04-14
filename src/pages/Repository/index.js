import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';

import { Container, Loading, BackButton, Owner } from './styles';
import api from '../../services/api';

export default function Repository() {
	const { repository } = useParams();

	const [repo, setRepo] = useState({});
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			const [repositoryData, issuesData] = await Promise.all([
				api.get(`/repos/${repository}`),
				api.get(`/repos/${repository}/issues`, {
					params: {
						state: 'open',
						per_page: 5,
					},
				}),
			]);

			setRepo(repositoryData.data);
			setIssues(issuesData.data);
			setLoading(false);
		}

		load();
	}, []);

	if (loading) {
		return (
			<Loading>
				<FaSpinner color="#FFF" size={50} />
			</Loading>
		);
	}

	return (
		<Container>
			<BackButton to="/">
				<FaArrowLeft color="#000" size={30} />
			</BackButton>
			<Owner>
				<img src={repo.owner.avatar_url} alt={repo.owner.login} />
				<h1>{repo.name}</h1>
				<p>{repo.description}</p>
			</Owner>
		</Container>
	);
}
