import Node from '../Node.js';
import CompileError from '../../utils/CompileError.js';
import removeTrailingComma from '../../utils/removeTrailingComma.js';
import AwaitExpression from './AwaitExpression';

export default class FunctionDeclaration extends Node {
	initialise(transforms) {
		if (this.generator && transforms.generator) {
			throw new CompileError('Generators are not supported', this);
		}

		this.body.createScope();

		if (this.id) {
			this.findScope(true).addDeclaration(this.id, 'function');
		}
		super.initialise(transforms);
	}

	transpile(code, transforms) {
		AwaitExpression.removeAsync(code, transforms, this.async, this.start);
		super.transpile(code, transforms);
		if (transforms.trailingFunctionCommas && this.params.length) {
			removeTrailingComma(code, this.params[this.params.length - 1].end);
		}
	}
}
