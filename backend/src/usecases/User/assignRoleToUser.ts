import { UserModel } from '@infra/sequelize/models/User.model';

export async function assignRoleToUser(userId: string, roleId: string) {
  const user = await UserModel.findByPk(userId);
  if (!user) throw new Error('Usuário não encontrado');

  user.set('roleId', roleId);
  await user.save();

  return user;
}
