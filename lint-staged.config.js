module.exports = {
  '*.ts': [() => 'npm run typecheck', 'npm run lint-fix'],
  '*': 'npm run prettier-fix',
};
