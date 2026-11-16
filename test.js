import { executarComandoCli, iniciarServidorEmulador } from './bin/ponte.js';

console.log('🧪 Iniciando Bateria de Testes do @ponte/cli & Emulador Offline...');

let pass = 0;
function assert(cond, msg) {
  if (!cond) throw new Error('FALHA: ' + msg);
  pass++;
  console.log('  ✅ ' + msg);
}

assert(executarComandoCli(['cep', '01310-100']).uf === 'SP', 'Comando CLI "ponte cep" funciona');
assert(executarComandoCli(['cpf', '52998224725']).valido === true, 'Comando CLI "ponte cpf" valida Módulo 11');
assert(executarComandoCli(['rastreio', 'AA123456785BR']).ok === true, 'Comando CLI "ponte rastreio" funciona');
assert(executarComandoCli(['fipe', '005340-6']).marca === 'Volkswagen', 'Comando CLI "ponte fipe" funciona');
assert(executarComandoCli(['compliance', '11122233396']).pep === true, 'Comando CLI "ponte compliance" identifica PEP');
assert(executarComandoCli(['clima', 'Curitiba']).uf === 'PR', 'Comando CLI "ponte clima" funciona');
assert(executarComandoCli(['status']).totalRepositorios === 32, 'Comando CLI "ponte status" reporta 32 repositórios');

// Teste rápido do servidor emulador
const srv = iniciarServidorEmulador(0);
const addr = srv.address();
const res = await fetch(`http://localhost:${addr.port}/v1/rastreio-pro/api/rastreio?codigo=AA123456785BR`);
const json = await res.json();
srv.close();
assert(json.ok === true && json.codigo === 'AA123456785BR', 'Emulador HTTP Localhost Offline responde com sucesso');

console.log(`\n🎉 Todos os ${pass} testes do @ponte/cli passaram com 100% de sucesso!`);
