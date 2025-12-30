import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Contact {
  id: number;
  name: string;
  status: 'online' | 'offline';
  lastMessage: string;
  unread: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
  isAnonymous?: boolean;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<'messenger' | 'contacts' | 'profile' | 'settings' | 'about'>('messenger');
  const [selectedContact, setSelectedContact] = useState<number | null>(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [contacts] = useState<Contact[]>([
    { id: 1, name: 'Анна Петрова', status: 'online', lastMessage: 'Привет! Как дела?', unread: 2 },
    { id: 2, name: 'Иван Сидоров', status: 'offline', lastMessage: 'До встречи завтра', unread: 0 },
    { id: 3, name: 'Мария Иванова', status: 'online', lastMessage: 'Отправила файлы', unread: 1 },
    { id: 4, name: 'Петр Козлов', status: 'offline', lastMessage: 'Спасибо за помощь!', unread: 0 },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Привет! Как дела?', sender: 'other', time: '14:23' },
    { id: 2, text: 'Отлично, спасибо! А у тебя?', sender: 'me', time: '14:25' },
    { id: 3, text: 'Тоже всё хорошо. Хотел спросить про проект', sender: 'other', time: '14:27' },
    { id: 4, text: 'Да, конечно! Что именно интересует?', sender: 'me', time: '14:28' },
  ]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        sender: 'me',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isAnonymous,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentContact = contacts.find(c => c.id === selectedContact);

  const renderSidebar = () => (
    <div className="w-20 bg-sidebar flex flex-col items-center py-6 space-y-6">
      <div className="text-primary font-bold text-2xl">AN</div>
      <Separator className="w-12 bg-sidebar-border" />
      
      <nav className="flex flex-col space-y-4">
        <Button
          variant={activeSection === 'messenger' ? 'default' : 'ghost'}
          size="icon"
          className="rounded-lg"
          onClick={() => setActiveSection('messenger')}
        >
          <Icon name="MessageSquare" size={20} />
        </Button>
        
        <Button
          variant={activeSection === 'contacts' ? 'default' : 'ghost'}
          size="icon"
          className="rounded-lg"
          onClick={() => setActiveSection('contacts')}
        >
          <Icon name="Users" size={20} />
        </Button>
        
        <Button
          variant={activeSection === 'profile' ? 'default' : 'ghost'}
          size="icon"
          className="rounded-lg"
          onClick={() => setActiveSection('profile')}
        >
          <Icon name="User" size={20} />
        </Button>
        
        <Button
          variant={activeSection === 'settings' ? 'default' : 'ghost'}
          size="icon"
          className="rounded-lg"
          onClick={() => setActiveSection('settings')}
        >
          <Icon name="Settings" size={20} />
        </Button>
      </nav>

      <div className="flex-1" />
      
      <Button
        variant={activeSection === 'about' ? 'default' : 'ghost'}
        size="icon"
        className="rounded-lg"
        onClick={() => setActiveSection('about')}
      >
        <Icon name="Info" size={20} />
      </Button>
    </div>
  );

  const renderContactsList = () => (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск контактов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact.id)}
              className={`w-full p-3 rounded-lg mb-1 flex items-center space-x-3 transition-colors ${
                selectedContact === contact.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {contact.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                )}
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate">{contact.name}</span>
                  {contact.unread > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 font-medium">
                      {contact.unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderMessenger = () => (
    <>
      {renderContactsList()}
      
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {currentContact?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-medium">{currentContact?.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {currentContact?.status === 'online' ? 'В сети' : 'Не в сети'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'me'
                          ? message.isAnonymous
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-end space-x-2 mt-1">
                        <span className="text-xs opacity-70">{message.time}</span>
                        {message.isAnonymous && message.sender === 'me' && (
                          <Icon name="EyeOff" size={12} className="opacity-70" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center space-x-2 mb-3">
                <Switch
                  id="anonymous-mode"
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                />
                <Label htmlFor="anonymous-mode" className="text-sm cursor-pointer flex items-center space-x-1">
                  <Icon name="EyeOff" size={16} />
                  <span>Анонимный режим</span>
                </Label>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Paperclip" size={20} />
                </Button>
                
                <Input
                  placeholder="Введите сообщение..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                
                <Button variant="ghost" size="icon">
                  <Icon name="Smile" size={20} />
                </Button>
                
                <Button onClick={handleSendMessage}>
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="MessageSquare" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Выберите контакт для начала общения</p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderContacts = () => (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6">Контакты</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium">{contact.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {contact.status === 'online' ? '🟢 В сети' : '⚫ Не в сети'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedContact(contact.id);
                setActiveSection('messenger');
              }}
            >
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Написать
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-6 mb-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
              ВИ
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-medium mb-1">Вы</h2>
            <p className="text-muted-foreground">ID: 123456789</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground">Имя пользователя</Label>
            <Input defaultValue="Вы" className="mt-1" />
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground">Статус</Label>
            <Input defaultValue="Доступен для общения" className="mt-1" />
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground">О себе</Label>
            <Input defaultValue="Использую AleNA" className="mt-1" />
          </div>
        </div>

        <Button className="w-full mt-6">
          Сохранить изменения
        </Button>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex-1 p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>
      <div className="space-y-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-medium mb-4">Приватность</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-normal">Показывать статус онлайн</Label>
                <p className="text-sm text-muted-foreground">Другие увидят, когда вы в сети</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-normal">Читать сообщения анонимно</Label>
                <p className="text-sm text-muted-foreground">Отправитель не увидит, что вы прочитали</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-medium mb-4">Уведомления</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-normal">Звук уведомлений</Label>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <Label className="font-normal">Показывать превью сообщений</Label>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-medium mb-4">Безопасность</h3>
          <Button variant="outline" className="w-full justify-start">
            <Icon name="Lock" size={18} className="mr-2" />
            Изменить пароль
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="flex-1 p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-primary mb-4">AleNA</div>
        <p className="text-muted-foreground">Версия 1.0.0</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <h3 className="font-medium mb-3">О сервисе</h3>
        <p className="text-muted-foreground leading-relaxed">
          AleNA — минималистичный мессенджер с фокусом на приватность и функциональность. 
          Общайтесь свободно с режимом анонимности и наслаждайтесь чистым интерфейсом без отвлекающих элементов.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-4">
        <h3 className="font-medium mb-3">Особенности</h3>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-start">
            <Icon name="Check" size={18} className="mr-2 mt-0.5 text-primary" />
            <span>Режим анонимного общения</span>
          </div>
          <div className="flex items-start">
            <Icon name="Check" size={18} className="mr-2 mt-0.5 text-primary" />
            <span>Минималистичный дизайн</span>
          </div>
          <div className="flex items-start">
            <Icon name="Check" size={18} className="mr-2 mt-0.5 text-primary" />
            <span>Быстрая и удобная навигация</span>
          </div>
          <div className="flex items-start">
            <Icon name="Check" size={18} className="mr-2 mt-0.5 text-primary" />
            <span>Фокус на приватности</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-medium mb-3">Контакты</h3>
        <div className="space-y-2 text-muted-foreground">
          <p>Email: support@alena.messenger</p>
          <p>Telegram: @alena_support</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden">
      {renderSidebar()}
      
      {activeSection === 'messenger' && renderMessenger()}
      {activeSection === 'contacts' && renderContacts()}
      {activeSection === 'profile' && renderProfile()}
      {activeSection === 'settings' && renderSettings()}
      {activeSection === 'about' && renderAbout()}
    </div>
  );
};

export default Index;
