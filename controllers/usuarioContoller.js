const { Usuario } = require('../models')



const cadastro = (req, res) => {
    return res.render('cadastro', {title: " - Cadastro"});
}

const store = async (req, res) => {

    const { nome, nickname, email, senha, foto_perfil } = req.body
    
    const fotoPerfil = req.files; 
    
    const usuario = await Usuario.create({
      nome,
      nickname,
      email,
      senha, 
      foto_perfil: `images/fotos-perfil/${fotoPerfil[0].filename}`
    });

    return res.redirect('/home')
}

const editar = (req, res) => {
    return res.render('editar-perfil', { title:"Editar Perfil", css:"style-editar-perfil.css"});
}

const update = async (req, res) => {

    const { nome, biografia, foto_perfil } = req.body;
    const  {id}  = req.session.usuario;
    const fotoPerfil = req.files;  

    // buscar usuário no banco
    const usuario = await Usuario.findByPk(id);    

    // Verfica se o nome vai ser alterado
    if(usuario.nome != nome && nome != "") {
        usuario.nome = nome;
        await usuario.save();
    };

    // Verifica se a biografia vai ser alterada
    if(usuario.biografia != biografia && biografia != "") {
        usuario.biografia = biografia;
        await usuario.save();
    };    
    
    // Verfica se o usuário selecionou uma foto para altera-la
    if(fotoPerfil.length > 0){                
        if(usuario.foto_perfil != `images/fotos-perfil/${fotoPerfil[0].filename}` ) {
            usuario.foto_perfil = `images/fotos-perfil/${fotoPerfil[0].filename}`;
            await usuario.save();
        };
    };
    // Grava novos dados do usuário na sessão
    req.session.usuario = usuario
    
    return res.redirect('/home')
}


const adicionarFavorito = async (req, res) => {

    const { usuario_id, favorito_id } = req.params

    const usuarioLogado = await Usuario.findByPk(usuario_id)
    const favorito = await Usuario.findByPk(favorito_id)

    const resposta = await usuarioLogado.addFavorito(favorito)

    return res.json(resposta)

}

const exibirFavoritos = async (req, res) => {

    const { usuario_id } = req.params
    const usuarioLogado = await Usuario.findByPk(usuario_id)

    const favoritos = await usuarioLogado.getFavorito()

    return res.json(favoritos)
}

module.exports = { 
    cadastro,
    store,
    editar,
    update,
    adicionarFavorito,
    exibirFavoritos
}