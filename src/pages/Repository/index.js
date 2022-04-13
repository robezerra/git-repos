import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Container } from './styles';
import api from '../../services/api';

export default function Repository() {
	const { repository } = useParams();

	console.log(repository);

	return (
		<Container>
			<h1>{repository}</h1>
		</Container>
	);
}
