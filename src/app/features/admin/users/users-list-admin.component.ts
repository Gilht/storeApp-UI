import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersAdminService, UserAdmin } from './users-admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-list-admin',
  standalone: true,
  template: `
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h2 class="text-3xl font-bold text-gray-900">User Administrator</h2>
        <p class="mt-1 text-sm text-gray-600">System User Management Panel</p>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin h-12 w-12 border-4 border-primary-default border-t-transparent rounded-full"></div>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nombre</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Edad</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                  <th class="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (user of users(); track user.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ user.id }}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-primary-default rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {{ user.name.charAt(0) }}{{ user.lastname.charAt(0) }}
                        </div>
                        <div>
                          <div class="font-medium">{{ user.name }} {{ user.lastname }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ user.age }} años</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (user.active) {
                        <span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                          Activo
                        </span>
                      } @else {
                        <span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <span class="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
                          Inactivo
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button (click)="onDelete(user.id, user.name)" class="text-red-600 hover:text-red-700 font-medium transition-colors">Eliminar</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export default class UsersListAdminComponent implements OnInit {
  private readonly _usersService = inject(UsersAdminService);

  readonly users = signal<UserAdmin[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this._usersService.getAllUsers(0, 50).subscribe({
      next: (response) => {
        this.users.set(response.payload.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  async onDelete(userId: number, userName: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Delete user?',
      text: `Are you sure you want to delete "${userName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      this._usersService.deleteUser(userId).subscribe({
        next: async () => {
          await Swal.fire({
            icon: 'success',
            title: 'User deleted successfully',
            confirmButtonColor: '#f97316'
          });
          this.loadUsers();
        },
        error: async (error) => {
          await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Failed to delete the user',
            confirmButtonColor: '#f97316'
          });
        }
      });
    }
  }
}
